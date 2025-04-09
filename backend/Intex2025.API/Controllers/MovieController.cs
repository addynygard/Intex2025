using Microsoft.AspNetCore.Mvc;
using Intex2025.API.Data;
using Intex2025.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Intex2025.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovieController : ControllerBase
    {
        private readonly MovieDbContext _movieContext;

        public MovieController(MovieDbContext movieContext)
        {
            _movieContext = movieContext;
        }

        // 🎬 GET: /api/movie/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMovieById(string id)
        {
            var movie = await _movieContext.movies_titles
                .FirstOrDefaultAsync(m => m.show_id == id);

            if (movie == null)
                return NotFound();

            return Ok(movie);
        }

        // ⭐ GET: /api/movie/user-rating?userId=1&showId=s880
        [HttpGet("user-rating")]
        public async Task<IActionResult> GetUserRating(int userId, string showId)
        {
            var rating = await _movieContext.movies_ratings
                .Where(r => r.user_id == userId && r.show_id == showId)
                .Select(r => r.rating)
                .FirstOrDefaultAsync();

            return Ok(new { rating = rating ?? 0 });
        }
    }
}
