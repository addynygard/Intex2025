using Intex2025.API.Data;
using Intex2025.API.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<MovieDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalFrontend",
        policy => policy
            .WithOrigins(
                "http://localhost:5173",
                "https://mango-forest-0265fa21e.6.azurestaticapps.net",
                "https://recommendation-api-intex2025-bvhebjanhyfbeafy.eastus-01.azurewebsites.net"
            )
            .AllowAnyHeader()
            .AllowAnyMethod());
});

// Your services
builder.Services.AddScoped<IMovieService, MovieService>();
builder.Services.AddHttpClient<IRecommendationService, RecommendationService>();
builder.Services.AddScoped<TMovieRatingOperations>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// ✅ Add CSP header middleware here
app.Use(async (context, next) =>
{
    context.Response.Headers.Add("Content-Security-Policy",
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com; " +
        "style-src 'self' 'unsafe-inline' fonts.googleapis.com https://accounts.google.com; " +
        "img-src 'self' https://ashleestreamimages.blob.core.windows.net data:; " +
        "connect-src 'self' https://localhost:5000 http://localhost:8000 https://accounts.google.com https://oauth2.googleapis.com; " +
        "font-src 'self' fonts.gstatic.com data:; " +
        "frame-src 'self' https://accounts.google.com https://oauth2.googleapis.com; " +
        "frame-ancestors 'none'; " +
        "object-src 'none'; " +
        "form-action 'self'; " +
        "base-uri 'self';"
    );
    await next();
});

app.UseRouting();

app.UseCors("AllowLocalFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();
