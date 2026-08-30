using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RecipeShare.Api;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 1. إضافة قاعدة البيانات
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();

// 2. تفعيل خدمة الـ CORS للسماح لـ React بالتواصل مع .NET
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.WithOrigins(
            "http://localhost:5173",
            "http://localhost:3000",
            "https://recipe-share-project.vercel.app"
            ) // منافذ Vite و React
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

// 3. إعداد المصادقة بـ JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// 4. تفعيل سياسة الـ CORS (ترتيب هذا السطر مهم جداً!)
app.UseCors("AllowReactApp");
app.UseStaticFiles();
// ملاحظة: إذا كنت تشغل السيرفر على http://localhost:5082 يمكنك إيقاف UseHttpsRedirection مؤقتاً
// app.UseHttpsRedirection(); 

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();