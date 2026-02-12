    using Backend.Data;
    using Backend.Models;
    using Backend.Services;
    using Microsoft.AspNetCore.Authentication.JwtBearer;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.IdentityModel.Tokens;
    using System.Text;

    namespace Backend;

    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers()
                .AddJsonOptions(o =>
                {
                    o.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
                });

            // CORS konfiguracija
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReact",
                    policy =>
                    {
                        policy.WithOrigins("http://localhost:3000",
                        "http://localhost:5000",
                        "https://smart-cow-farm.vercel.app" 
                        )
                            .AllowAnyMethod()
                            .AllowAnyHeader()
                            .AllowCredentials()
                            .WithExposedHeaders("Content-Disposition")
                            .SetPreflightMaxAge(TimeSpan.FromHours(24));
                    });
            });

            builder.Services.AddScoped<IJwtServis, JwtServis>();
            builder.Services.AddScoped<IPasswordHasher<Korisnik>, PasswordHasher<Korisnik>>();

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "Backend",
                    ValidAudience = builder.Configuration["Jwt:Audience"] ?? "Frontend",
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ??
                        "ovaj-kljuc-mora-biti-minimum-32-karaktera-dugacak-123"))
                };
            });

            builder.Services.AddOpenApi();
            builder.Services.AddAuthorization();
            builder.Services.AddScoped<QuestPdfGenerator>();

            // baza
            builder.Services.AddDbContext<SmartCowFarmDatabaseContext>(
                options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
            );

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }
            // CORS middleware
            app.UseCors("AllowReact");

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }