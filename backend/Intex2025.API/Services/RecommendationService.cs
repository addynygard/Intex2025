using System.Net.Http;
using System.Net.Http.Json;
using Intex2025.API.Models;
using System.Net.Http;
using System.Net.Http.Json;
using Intex2025.API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;



public class RecommendationService : IRecommendationService
{
    private readonly HttpClient _httpClient;
    private readonly MovieDbContext _context;
    private readonly String _baseUrl;

    public RecommendationService(HttpClient httpClient, MovieDbContext context, IConfiguration config)
    {
        _httpClient = httpClient;
        _context = context;
        _baseUrl = config["RecommendationApi:BaseUrl"] ?? throw new Exception("Missing API Base Url");
    }

    public async Task<List<movies_title>> GetSimilarMoviesAsync(string title)
    {
        var response = await _httpClient.GetFromJsonAsync<List<RecommendationResult>>(
            $"http://localhost:8000/recommendations/similar/{Uri.EscapeDataString(title)}");

        if (response == null)
            return new List<movies_title>();

        var titles = response.Select(r => r.Title.ToLower()).ToList();

        return await _context.movies_titles
            .Where(m => m.title != null && titles.Contains(m.title.ToLower()))
            .ToListAsync();
    }

    public async Task<List<movies_title>> GetTopRatedMoviesAsync()
{
    var response = await _httpClient.GetFromJsonAsync<List<RecommendationResult>>(
        "http://localhost:8000/recommendations/top-rated");

    if (response == null) return new List<movies_title>();

    var titles = response.Select(r => r.Title.ToLower()).ToList();

    return await _context.movies_titles
        .Where(m => m.title != null && titles.Contains(m.title.ToLower()))
        .ToListAsync();
}

public async Task<List<movies_title>> GetTopByGenreAsync(string genre)
{
    var response = await _httpClient.GetFromJsonAsync<List<RecommendationResult>>(
        $"http://localhost:8000/recommendations/genre/{Uri.EscapeDataString(genre)}");

    if (response == null) return new List<movies_title>();

    var titles = response.Select(r => r.Title.ToLower()).ToList();

    return await _context.movies_titles
        .Where(m => m.title != null && titles.Contains(m.title.ToLower()))
        .ToListAsync();
}

public async Task<List<movies_title>> GetUserRecommendationsAsync(int userId)
{
    var response = await _httpClient.GetFromJsonAsync<List<RecommendationResult>>(
        $"http://localhost:8000/recommendations/user/{userId}");

    if (response == null) return new List<movies_title>();

    var titles = response.Select(r => r.Title.ToLower()).ToList();

    return await _context.movies_titles
        .Where(m => m.title != null && titles.Contains(m.title.ToLower()))
        .ToListAsync();
}



    private class RecommendationResult
    {
        public string Title { get; set; } = string.Empty;
    }
}
