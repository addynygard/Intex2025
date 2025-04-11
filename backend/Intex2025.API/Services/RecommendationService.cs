using System.Net.Http;
using System.Net.Http.Json;
using Intex2025.API.Models;
using Intex2025.API.Data;
using Microsoft.EntityFrameworkCore;
using Intex2025.API.Helpers;

public class RecommendationService : IRecommendationService
{
    private readonly HttpClient _httpClient;
    private readonly MovieDbContext _context;

    public RecommendationService(HttpClient httpClient, MovieDbContext context)
    {
        _httpClient = httpClient;
        _context = context;
    }

   public async Task<List<movies_title>> GetSimilarMoviesAsync(string title)
{
    var response = await _httpClient.GetFromJsonAsync<List<RecommendationResult>>(
        $"{RecommenderLink.REC_URL}/recommendations/similar/{Uri.EscapeDataString(title)}");

    if (response == null || response.Count == 0)
    {
        Console.WriteLine($"❌ FastAPI returned no titles for: {title}");
        return new List<movies_title>();
    }

    var titles = response.Select(r => r.Title.ToLower().Trim()).ToList();
    Console.WriteLine($"🔍 Titles from FastAPI: {string.Join(", ", titles)}");

    var dbTitles = await _context.movies_titles
        .Select(m => new { m.title, m.show_id })
        .ToListAsync();

    var matched = dbTitles
        .Where(m => m.title != null && titles.Contains(m.title.ToLower().Trim()))
        .ToList();

    Console.WriteLine($"✅ Matched {matched.Count} titles in the DB");

    // Optionally return full models again
    return await _context.movies_titles
        .Where(m => m.title != null && titles.Contains(m.title.ToLower().Trim()))
        .ToListAsync();
}

    public async Task<List<movies_title>> GetTopRatedMoviesAsync()
    {
        return await FetchAndMapTitlesAsync($"{RecommenderLink.REC_URL}/recommendations/top-rated");
    }

    public async Task<List<movies_title>> GetTopByGenreAsync(string genre)
    {
        return await FetchAndMapTitlesAsync($"{RecommenderLink.REC_URL}/recommendations/genre/{Uri.EscapeDataString(genre)}");
    }

    public async Task<List<movies_title>> GetUserRecommendationsAsync(int userId)
    {
        return await FetchAndMapTitlesAsync($"{RecommenderLink.REC_URL}/recommendations/user/{userId}");
    }

    /// <summary>
    /// Shared method to fetch a list of title strings from FastAPI and match them to full movie entities.
    /// </summary>
    private async Task<List<movies_title>> FetchAndMapTitlesAsync(string requestUrl)
    {
        try
        {
            var response = await _httpClient.GetFromJsonAsync<List<RecommendationResult>>(requestUrl);

            if (response == null || response.Count == 0)
            {
                Console.WriteLine($"❌ No recommendations returned from: {requestUrl}");
                return new List<movies_title>();
            }

            var titles = response.Select(r => r.Title.ToLower()).ToList();

            return await _context.movies_titles
                .Where(m => m.title != null && titles.Contains(m.title.ToLower()))
                .ToListAsync();
        }
        catch (HttpRequestException httpEx)
        {
            Console.WriteLine($"❌ HTTP error when calling recommendation API: {httpEx.Message}");
            return new List<movies_title>();
        }
        catch (NotSupportedException nsEx)
        {
            Console.WriteLine($"❌ Response is not valid JSON: {nsEx.Message}");
            return new List<movies_title>();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Unexpected error: {ex.Message}");
            return new List<movies_title>();
        }
    }


    private class RecommendationResult
    {
        public string Title { get; set; } = string.Empty;
    }
}
