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

    public RecommendationController(IRecommendationService recommendationService)
    {
        _recommendationService = recommendationService;
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

}

}

