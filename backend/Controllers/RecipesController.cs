using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeShare.Api.Models;
using Microsoft.AspNetCore.Authorization;

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

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Recipe>>> GetRecipes()
    {
        var recipes = await _context.Recipes.ToListAsync();
        return Ok(recipes);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<Recipe>> CreateRecipe(Recipe recipe)
    {
        try
        {
            // 1. استخراج الـ UserId من الـ Token
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                           ?? User.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return BadRequest(new
                {
                    message = $"مشكلة في الـ Token: القيمة المستخرجة هي '{userIdClaim}' وليست رقماً صحيحاً."
                });
            }

            // 2. التحقق من وجود المستخدم في قاعدة البيانات
            var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
            if (!userExists)
            {
                return BadRequest(new
                {
                    message = $"المستخدم صاحب الرقم ({userId}) غير موجود في قاعدة البيانات. يرجى إعادة تسجيل الدخول."
                });
            }

            recipe.UserId = userId;
            recipe.User = null; // تفريغ الـ Navigation Property لمنع التعارض

            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();

            // 3. إرجاع النتيجة بنجاح مباشرة بدلاً من CreatedAtAction لتجنب خطأ الـ Routing
            return Ok(recipe);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                message = ex.Message,
                inner = ex.InnerException?.Message
            });
        }
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRecipe(int id)
    {
        var recipe = await _context.Recipes.FindAsync(id);
        if (recipe == null)
        {
            return NotFound();
        }
        _context.Recipes.Remove(recipe);
        await _context.SaveChangesAsync();
        return NoContent();
    }

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