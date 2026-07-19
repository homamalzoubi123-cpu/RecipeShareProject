using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeShare.Api.Models;
using System.Security.Claims;

namespace RecipeShare.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FollowController : ControllerBase
{
    public readonly AppDbContext _context;
    public FollowController(AppDbContext context)
    {
        _context = context;
    }
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> FollowUser([FromBody] int followingId)
    {
        var followerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        if (followerId == followingId)
        {
            return BadRequest("You cannot follow yourself.");
        }
        var alreadyFollowing = await _context.Follows
            .AnyAsync(f => f.FollowerId == followerId && f.FollowingId == followingId);
        if (alreadyFollowing)
        {
            return BadRequest("You are already following this user.");
        }
        var follow = new Follow 
        { FollowerId = followerId, FollowingId = followingId };
        _context.Follows.Add(follow);
        await _context.SaveChangesAsync();
        return Ok (new { message = "Erfolgreich gefolgt." });
    }
    [HttpGet("{userId}")]
    public async Task<ActionResult<IEnumerable<object>>> GetFollowing(int userId)
    {
        var following = await _context.Follows
            .Where(f => f.FollowerId == userId)
            .Select(f => new { f.FollowingId, f.Following!.Username })
            .ToListAsync();

        return Ok(following);
    }
    [Authorize]
    [HttpDelete("{followingId}")]
    public async Task<IActionResult> UnfollowUser(int followingId)
    {
        var followerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var follow = await _context.Follows
            .FirstOrDefaultAsync(f => f.FollowerId == followerId && f.FollowingId == followingId);

        if (follow == null)
        {
            return NotFound("Du folgst diesem Benutzer nicht.");
        }

        _context.Follows.Remove(follow);
        await _context.SaveChangesAsync();

        return NoContent();
    }

}
