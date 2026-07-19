using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeShare.Api.Models;
namespace RecipeShare.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FavoriteController : ControllerBase
{
    public readonly AppDbContext _context;
    public FavoriteController(AppDbContext context)
    {
        _context = context;
    }
    [HttpGet]
    public async Task <ActionResult<IEnumerable<Favorite>>> GetFavorites()
    {
        var favorites = await _context.Favorites.ToListAsync();
        return Ok(favorites);
    }
    [HttpPost]
    public async Task<ActionResult<Favorite>> CreateFavorite(Favorite favorite)
    {
        _context.Favorites.Add(favorite);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetFavorites), new { id = favorite.Id }, favorite);
    }
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteFavorite(int id)
    {
        var favorite = await _context.Favorites.FindAsync(id);
        if (favorite == null)
        {
            return NotFound();
        }
        _context.Favorites.Remove(favorite);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}