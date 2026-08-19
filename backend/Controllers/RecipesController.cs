using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeShare.Api.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace RecipeShare.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecipesController : ControllerBase
{
    private readonly AppDbContext _context;

    public RecipesController(AppDbContext context)
    {
        _context = context;
    }

    // 1. Alle Rezepte holen (für die Hauptseite / Home)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetRecipes()
    {
        var recipes = await _context.Recipes
            .Include(r => r.User) // ربط جدول الوصفات بجدول المستخدمين في Database
            .Select(r => new
            {
                r.Id,
                r.UserId,
                UserName = r.User != null ? r.User.Username : "Unbekannt", // جلب اسم المستخدم
                r.Title,
                r.Description,
                r.Instructions,
                r.PrepTimeMinutes,
                r.Difficulty,
                r.ImageUrl,
                r.CreatedAt
            })
            .ToListAsync();

        return Ok(recipes);
    }

    // 2. Nur eigene Rezepte holen (für die Profilseite)
    [HttpGet("my-recipes")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<Recipe>>> GetMyRecipes()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                       ?? User.FindFirst("id")?.Value;

        if (string.IsNullOrEmpty(userIdClaim))
            return Unauthorized(new { error = "User-ID nicht im Token gefunden." });

        int userId = int.Parse(userIdClaim);

        var myRecipes = await _context.Recipes
            .Where(r => r.UserId == userId)
            .ToListAsync();

        return Ok(myRecipes);
    }

    // 3. Neues Rezept erstellen
    [HttpPost]
    [Authorize]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> CreateRecipe([FromForm] CreateRecipeDto dto)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                           ?? User.FindFirst("id")?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new { error = "User-ID konnte nicht aus dem Token gelesen werden." });
            }

            int userId = int.Parse(userIdClaim);

            string? imagePath = null;

            if (dto.ImageFile != null && dto.ImageFile.Length > 0)
            {
                var wwwrootFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                if (!Directory.Exists(wwwrootFolder))
                    Directory.CreateDirectory(wwwrootFolder);

                var uploadsFolder = Path.Combine(wwwrootFolder, "uploads");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.ImageFile.FileName);
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.ImageFile.CopyToAsync(stream);
                }

                imagePath = $"/uploads/{fileName}";
            }

            var recipe = new Recipe
            {

                UserId = userId,
                Title = dto.Title,
                Description = dto.Description,
                Instructions = dto.Instructions,
                PrepTimeMinutes = dto.PrepTimeMinutes,
                Difficulty = dto.Difficulty,
                ImageUrl = imagePath,
                CreatedAt = DateTime.UtcNow
            };

            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();

            return Ok(recipe);
        }
        catch (Exception ex)
        {
            var errorMessage = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
            Console.WriteLine($"[Error CreateRecipe]: {errorMessage}");

            return StatusCode(500, new { error = errorMessage });
        }
    }

    // 4. Rezept löschen (geschützt & berechtigungsgeprüft)
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteRecipe(int id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                       ?? User.FindFirst("id")?.Value;

        if (string.IsNullOrEmpty(userIdClaim))
            return Unauthorized(new { error = "User-ID nicht im Token gefunden." });

        int userId = int.Parse(userIdClaim);

        var recipe = await _context.Recipes.FindAsync(id);
        if (recipe == null)
        {
            return NotFound(new { error = "Rezept nicht gefunden." });
        }

        // Sicherheitsprüfung: Gehört das Rezept dem aktuellen Nutzer?
        if (recipe.UserId != userId)
        {
            return Forbid(); // 403 Forbidden
        }

        _context.Recipes.Remove(recipe);
        await _context.SaveChangesAsync();

        return NoContent(); // 204 Success
    }

    // 5. Mehrere Rezepte auf einmal erstellen
    [HttpPost("bulk")]
    public async Task<IActionResult> CreateRecipesBulk(List<Recipe> recipes)
    {
        if (recipes == null || !recipes.Any())
        {
            return BadRequest();
        }
        await _context.Recipes.AddRangeAsync(recipes);
        await _context.SaveChangesAsync();
        return Ok(new { message = $"Created {recipes.Count} recipes" });
    }
}