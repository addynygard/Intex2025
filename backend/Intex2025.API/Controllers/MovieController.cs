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

        public MovieController(MovieDbContext context)
        {
            _movieContext = context;
        }

        // GET: api/movie
        [HttpGet]
        public async Task<ActionResult<IEnumerable<movies_title>>> GetAllMovies()
        {
            return await _movieContext.movies_titles.ToListAsync();
        }

        [HttpGet("filter")]
        public async Task<IActionResult> GetMoviesByGenre([FromQuery] string? genre)
        {
            Console.WriteLine($"Requested genre: {genre}");

            if (string.IsNullOrEmpty(genre) || genre == "Featured")
            {
                var all = await _movieContext.movies_titles.ToListAsync();
                return Ok(all);
            }

            if (genre == "Unknown")
            {
                var all = await _movieContext.movies_titles.ToListAsync();
                var filtered = all.Where(m =>
                    m.Action != 1 &&
                    m.Adventure != 1 &&
                    m.Anime_Series_International_TV_Shows != 1 &&
                    m.British_TV_Shows_Docuseries_International_TV_Shows != 1 &&
                    m.Children != 1 &&
                    m.Comedies != 1 &&
                    m.Comedies_Dramas_International_Movies != 1 &&
                    m.Comedies_International_Movies != 1 &&
                    m.Comedies_Romantic_Movies != 1 &&
                    m.Crime_TV_Shows_Docuseries != 1 &&
                    m.Documentaries != 1 &&
                    m.Documentaries_International_Movies != 1 &&
                    m.Docuseries != 1 &&
                    m.Dramas != 1 &&
                    m.Dramas_International_Movies != 1 &&
                    m.Dramas_Romantic_Movies != 1 &&
                    m.Family_Movies != 1 &&
                    m.Fantasy != 1 &&
                    m.Horror_Movies != 1 &&
                    m.International_Movies_Thrillers != 1 &&
                    m.International_TV_Shows_Romantic_TV_Shows_TV_Dramas != 1 &&
                    m.Kids__TV != 1 &&
                    m.Language_TV_Shows != 1 &&
                    m.Musicals != 1 &&
                    m.Nature_TV != 1 &&
                    m.Reality_TV != 1 &&
                    m.Spirituality != 1 &&
                    m.TV_Action != 1 &&
                    m.TV_Comedies != 1 &&
                    m.TV_Dramas != 1 &&
                    m.Talk_Shows_TV_Comedies != 1 &&
                    m.Thrillers != 1
                ).ToList();

                return Ok(filtered);
            }

            var genreMap = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
            {
                { "Action", "action" },
                { "Adventure", "adventure" },
                // ... (rest of genreMap — unchanged)
                { "Thrillers", "thrillers" }
            };

            if (!genreMap.TryGetValue(genre, out var columnName))
            {
                Console.WriteLine("Genre not found in map");
                return BadRequest($"Invalid genre: {genre}");
            }

            try
            {
                IQueryable<movies_title> query = _movieContext.movies_titles;

                switch (columnName)
                {
                    case "action":
                        query = query.Where(m => m.Action == 1);
                        break;
                    // ... repeat for others ...
                    case "thrillers":
                        query = query.Where(m => m.Thrillers == 1);
                        break;
                    default:
                        return BadRequest("Unsupported genre.");
                }

                var filtered = await query.ToListAsync();
                Console.WriteLine($"Found {filtered.Count} movies for genre: {columnName}");
                return Ok(filtered);
            }
            catch (Exception ex)
            {
                Console.WriteLine("EXCEPTION:");
                Console.WriteLine(ex.ToString());
                return StatusCode(500, "Internal Server Error: " + ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<movies_title>> GetMovie(string id)
        {
            var movie = await _movieContext.movies_titles.FindAsync(id);
            if (movie == null)
                return NotFound();

            return movie;
        }

        [HttpPost]
        public async Task<ActionResult<movies_title>> CreateMovie(movies_title movie)
        {
            _movieContext.movies_titles.Add(movie);
            await _movieContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetMovie), new { id = movie.show_id }, movie);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMovie(string id)
        {
            var movie = await _movieContext.movies_titles.FindAsync(id);
            if (movie == null)
                return NotFound();

            _movieContext.movies_titles.Remove(movie);
            await _movieContext.SaveChangesAsync();
            return NoContent();
        }

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
