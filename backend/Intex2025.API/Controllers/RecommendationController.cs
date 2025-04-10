using Microsoft.AspNetCore.Mvc;
using Intex2025.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Intex2025.API.Controllers
{
    [Route("api/[controller]")]
[ApiController]
public class RecommendationController : ControllerBase
{
    private readonly IRecommendationService _recommendationService;
    private readonly IMovieService _movieService;

    public RecommendationController(IRecommendationService recommendationService, IMovieService movieService)
    {
        _recommendationService = recommendationService;
        _movieService = movieService;
    }

    [HttpGet("similar/{title}")]
    public async Task<IActionResult> GetSimilarMovies(string title)
    {
        var results = await _recommendationService.GetSimilarMoviesAsync(title);
        return Ok(results);
    }

    [HttpGet("top-rated")]
    public async Task<IActionResult> GetTopRated()
    {
        var results = await _recommendationService.GetTopRatedMoviesAsync();
        return Ok(results);
    }

    [HttpGet("genre/{genre}")]
    public async Task<IActionResult> GetTopByGenre(string genre)
    {
        var results = await _recommendationService.GetTopByGenreAsync(genre);
        return Ok(results);
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserRecommendations(int userId)
    {
        var results = await _recommendationService.GetUserRecommendationsAsync(userId);
        return Ok(results);
    }

    [HttpGet("by-title/{title}")]
    public async Task<IActionResult> GetMovieByTitle(string title)
    {
        var movie = await _movieService.GetMovieByTitleAsync(title);
        if (movie == null)
        {
            return NotFound();
        }

        return Ok(movie);
    }
    [HttpGet("recommendations/cluster/{userId}")]
    public async Task<IActionResult> GetClusterRecommendations(int userId)
    {
        using (var httpClient = new HttpClient())
        {
            try
            {
                // Replace with your FastAPI URL
                var fastApiUrl = $"http://localhost:8000/recommendations/cluster/{userId}";
                var response = await httpClient.GetAsync(fastApiUrl);

                if (!response.IsSuccessStatusCode)
                    return NotFound("Recommendations not found for this user.");

                var content = await response.Content.ReadAsStringAsync();
                return Content(content, "application/json");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error fetching recommendations: {ex.Message}");
            }
        }
    }
}
}



