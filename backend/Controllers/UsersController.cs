using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeShare.Api.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace RecipeShare.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    // 🔑 Aktuelles Profil abrufen
    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                       ?? User.FindFirst("id")?.Value;

        if (string.IsNullOrEmpty(userIdClaim))
            return Unauthorized(new { error = "User-ID nicht im Token gefunden." });

        int userId = int.Parse(userIdClaim);

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            return NotFound(new { error = "Benutzer nicht gefunden." });

        return Ok(new
        {
            id = user.Id,
            username = user.Username,
            email = user.Email,
            imageUrl = user.ProfileImageUrl
        });
    }

    // 📸 Profilbild hochladen (WICHTIG: [Authorize] hinzugefügt!)
    [HttpPost("upload-profile-image")]
    [Authorize]
    public async Task<IActionResult> UploadProfileImage([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { error = "Keine Datei hochgeladen." });

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                       ?? User.FindFirst("id")?.Value;

        if (string.IsNullOrEmpty(userIdClaim))
            return Unauthorized(new { error = "User-ID nicht im Token gefunden." });

        int userId = int.Parse(userIdClaim);
        var user = await _context.Users.FindAsync(userId);

        if (user == null)
            return NotFound(new { error = "Benutzer nicht gefunden." });

        var wwwrootFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        var uploadsFolder = Path.Combine(wwwrootFolder, "uploads");

        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
        var filePath = Path.Combine(uploadsFolder, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        user.ProfileImageUrl = $"/uploads/{fileName}";
        await _context.SaveChangesAsync();

        return Ok(new { imageUrl = user.ProfileImageUrl });
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        var users = await _context.Users.ToListAsync();
        return Ok(users);
    }

    [HttpPost]
    public async Task<ActionResult<User>> CreateUser(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetUsers), new { id = user.Id }, user);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound();
        }
        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("bulk")]
    public async Task<IActionResult> CreateUsersBulk(List<User> users)
    {
        if (users == null || !users.Any())
        {
            return BadRequest();
        }
        await _context.Users.AddRangeAsync(users);
        await _context.SaveChangesAsync();
        return Ok(new { message = $"Created {users.Count} users" });
    }
}