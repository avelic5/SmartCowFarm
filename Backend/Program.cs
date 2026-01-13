using Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddControllers()
            .AddJsonOptions(o =>
            {
                o.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
            });

        // **DODANO: CORS services OVJJE prije Build()**
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
            {
                policy.SetIsOriginAllowed(origin =>
                {
                    return origin.StartsWith("http://localhost:") ||
                           origin.StartsWith("https://localhost:") ||
                           origin == "https://smart-cow-farm.vercel.app"; // vercel production
                })
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
            });
        });

        // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
        builder.Services.AddOpenApi();

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

        app.UseHttpsRedirection();

        // **DODANO: Ovo omogućuje CORS middleware**
        app.UseCors("AllowFrontend"); // <-- VAŽNO!

        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}