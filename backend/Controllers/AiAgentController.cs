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
                return BadRequest(new { response = "Die Frage darf nicht leer sein." });

            var apiKey = _configuration["Gemini:ApiKey"];

            if (string.IsNullOrEmpty(apiKey))
            {
                return StatusCode(500, new { response = "Gemini API Key fehlt. Bitte Gemini:ApiKey in appsettings.json oder User-Secrets hinterlegen." });
            }

            try
            {
                var client = new Client(apiKey: apiKey);

                // Modellname aus der Konfiguration, mit sinnvollem Standardwert
                var model = _configuration["Gemini:Model"] ?? "gemini-3.6-flash";

                var response = await client.Models.GenerateContentAsync(
                    model: model,
                    contents: request.Prompt
                );

                return Ok(new { response = response.Text });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { response = $"Gemini-Fehler: {ex.Message}" });
            }
        }
    }

    public class ChatRequest
    {
        public string Prompt { get; set; } = string.Empty;
    }
}