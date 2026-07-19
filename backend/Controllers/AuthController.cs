using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RecipeShare.Api.DTOs;
using RecipeShare.Api.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
namespace RecipeShare.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController: ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;
    public AuthController(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _config = configuration;
    }
    //Register — بيتأكد الإيميل مش مستخدم قبل، بيشفر الباسورد بـBCrypt، وبيحفظ اليوز
    [HttpPost("register")]
    public async Task<ActionResult<User>> Register(RegisterDto dto)

    {
        if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
        {
            return BadRequest("\"Diese E-Mail wird bereits verwendet.\"");
        }
        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return Ok(new { user.Id, user.Username, user.Email });
    }
    //Login — بيتحقق من الإيميل والباسورد المشفر، ولو صح بيولّد JWT token صالح لمدة 7 أيا
    [HttpPost("login")]
   public async Task<ActionResult> Login(LoginDto dto)
    {
        var user =await _context.Users.FirstOrDefaultAsync(u =>u.Email == dto.Email);
        if(user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))

        {
            return Unauthorized("E-Mail oder Passwort ist falsch.");
        }
        var token = GenerateJwtToken(user);
        return Ok(new { token });
    }
    //GenerateJwtToken — بيحط معلومات أساسية عن اليوزر (Id, Username, Email) جوا الـtoken نفسه، عشان لما يرجع الطلب بعدين نعرف مين هو من غير ما نرجع نسأل قاعدة البيانا 
    private string GenerateJwtToken(User user)
    { 
        var claims = new[]
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Name, user.Username),
        new Claim(ClaimTypes.Email, user.Email)
    };
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
           issuer: _config["Jwt:Issuer"],
           audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
    );
        return new JwtSecurityTokenHandler().WriteToken(token);
            
    }
    
}
