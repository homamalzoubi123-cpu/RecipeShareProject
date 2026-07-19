using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;    
using RecipeShare.Api.Models;
using System.Security.Claims;
namespace RecipeShare.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RatingController : ControllerBase
{
private readonly AppDbContext _context;
    public RatingController(AppDbContext context)
    {
        _context = context;
    }
    [HttpGet("{recipeId}")]
    public async Task<ActionResult<IEnumerable<Rating>>> GetRatings(int recipeId)
    {
        var ratings = await _context.Ratings
            .Where(r => r.RecipeId == recipeId)
            .ToListAsync();

        return Ok(ratings);
    }
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<Rating>> CreateRating(int recipeId,int stars)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        if(stars < 1 || stars > 5)
        { return BadRequest("Rating must be between 1 and 5."); }
        var existingRating = await _context.Ratings
            .FirstOrDefaultAsync(r => r.RecipeId == recipeId && r.UserId == userId);
        if (existingRating != null)
        {
            existingRating.Stars = stars;
        }
        else
        {
            var newRating = new Rating
            {
                RecipeId = recipeId,
                UserId = userId,
                Stars = stars,
                CreatedAt = DateTime.UtcNow
            };
            _context.Ratings.Add(newRating);
        }
        await _context.SaveChangesAsync();
        return  Ok();
    }
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteRating(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var rating = await _context.Ratings.FindAsync(id);

        if (rating == null)
        {
            return NotFound();
        }

        if (userId != rating.UserId)
        {
            return Forbid();
        }

        _context.Ratings.Remove(rating);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
