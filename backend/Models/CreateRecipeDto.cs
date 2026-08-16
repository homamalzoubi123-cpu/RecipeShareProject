using Microsoft.AspNetCore.Http;

namespace RecipeShare.Api.Models
{
    public class CreateRecipeDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Instructions { get; set; } = string.Empty;
        public int PrepTimeMinutes { get; set; }
        public string Difficulty { get; set; } = "Easy";
        public IFormFile? ImageFile { get; set; } // استقبال الملف هنا
    }
}