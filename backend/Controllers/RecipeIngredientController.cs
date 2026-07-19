using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeShare.Api.Models;
namespace RecipeShare.Api.Controllers;

    [ApiController]
    [Route("api/[controller]")]
    public class RecipeIngredientController : ControllerBase
    {
        public readonly AppDbContext _context;

        public RecipeIngredientController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RecipeIngredient>>> GetRecipeIngredients()
        {
            var recipeIngredients = await _context.RecipeIngredients.ToListAsync();
            return Ok(recipeIngredients);
        }
        [HttpPost]
        public async Task<ActionResult<RecipeIngredient>> CreateRecipeIngredient(RecipeIngredient recipeIngredient)
        {
            _context.RecipeIngredients.Add(recipeIngredient);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetRecipeIngredients), new { id = recipeIngredient.Id }, recipeIngredient);
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteRecipeIngredient(int id)
        {
            var recipeIngredient = await _context.RecipeIngredients.FindAsync(id);
            if (recipeIngredient == null)
            {
                return NotFound();
            }
            _context.RecipeIngredients.Remove(recipeIngredient);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

