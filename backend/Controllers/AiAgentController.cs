using Microsoft.AspNetCore.Mvc;
using Google.GenAI;

namespace RecipeShare.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AiAgentController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AiAgentController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("chat")]
        public async Task<IActionResult> Chat([FromBody] ChatRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Prompt))
                return BadRequest(new { response = "الطلب فارغ" });

            var apiKey = _configuration["Gemini:ApiKey"];

            if (string.IsNullOrEmpty(apiKey))
            {
                return StatusCode(500, new { response = "Gemini API Key غير موجود في appsettings.json" });
            }

            try
            {
                var client = new Client(apiKey: apiKey);

                // التحديث لاسم الموديل الجديد الموصى به
                var response = await client.Models.GenerateContentAsync(
                    model: "gemini-3.6-flash",
                    contents: request.Prompt
                );

                return Ok(new { response = response.Text });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { response = $"خطأ Gemini: {ex.Message}" });
            }
        }
    }

    public class ChatRequest
    {
        public string Prompt { get; set; } = string.Empty;
    }
}