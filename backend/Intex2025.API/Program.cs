using Intex2025.API.Data;
using Intex2025.API.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.


builder.Services.AddDbContext<MovieDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalFrontend",
        policy => policy
            .WithOrigins("http://localhost:5173", "https://mango-forest-0265fa21e.6.azurestaticapps.net")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

// Your services
builder.Services.AddScoped<IMovieService, MovieService>();
// ✅ THIS IS THE MISSING PIECE
builder.Services.AddHttpClient<IRecommendationService, RecommendationService>();
builder.Services.AddScoped<TMovieRatingOperations>();



var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHttpsRedirection();


app.UseCors("AllowLocalFrontend");
// app.UseCors("AllowReactDev");


app.UseAuthorization();

app.MapControllers();

app.Run();
