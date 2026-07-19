using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeShare.Api.Models;
using System.Security.Claims;
namespace RecipeShare.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentController : ControllerBase
{
    private readonly AppDbContext _context;
    public CommentController(AppDbContext context)
    {
        _context = context;
    }
    [HttpGet("{recipeId}")]
    public async Task<ActionResult<IEnumerable<Comment>>> GetComments(int recipeId)
    {
        var comments = await _context.Comments
            .Where(c => c.RecipeId == recipeId)
            .ToListAsync();
        return Ok(comments);
    }
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<Comment>> CreateComment(int recipeId, string text)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var comment = new Comment
        {
            RecipeId = recipeId,
            UserId = userId,
            Text = text,
            CreatedAt = DateTime.UtcNow
        };
        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetComments), new { recipeId = comment.RecipeId }, comment);
    }
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteComment(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var comment = await _context.Comments.FindAsync(id);
        if (comment == null)
        {
            return NotFound();
        }
        if (userId != comment.UserId)
        {
            return Forbid();
        }
        
        _context.Comments.Remove(comment);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}