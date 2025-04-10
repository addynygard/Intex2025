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
                { "Action", "Action" },
                { "Adventure", "Adventure" },
                { "TV Action", "TV_Action" },
                { "Anime Series International TV Shows", "Anime_Series_International_TV_Shows" },
                { "Docuseries", "Docuseries" },
                { "British TV Shows Docuseries International TV Shows", "British_TV_Shows_Docuseries_International_TV_Shows" },
                { "Crime TV Shows Docuseries", "Crime_TV_Shows_Docuseries" },
                { "Children", "Children" },
                { "Kids' TV", "Kids__TV" },
                { "Comedies", "Comedies" },
                { "Comedies Dramas International Movies", "Comedies_Dramas_International_Movies" },
                { "Comedies International Movies", "Comedies_International_Movies" },
                { "Comedies Romantic Movies", "Comedies_Romantic_Movies" },
                { "Talk Shows TV Comedies", "Talk_Shows_TV_Comedies" },
                { "TV Comedies", "TV_Comedies" },
                { "Documentaries", "Documentaries" },
                { "Documentaries International Movies", "Documentaries_International_Movies" },
                { "Nature TV", "Nature_TV" },
                { "Dramas", "Dramas" },
                { "Dramas International Movies", "Dramas_International_Movies" },
                { "TV Dramas", "TV_Dramas" },
                { "Dramas Romantic Movies", "Dramas_Romantic_Movies" },
                { "Family Movies", "Family_Movies" },
                { "Fantasy", "Fantasy" },
                { "Horror Movies", "Horror_Movies" },
                { "International Movies Thrillers", "International_Movies_Thrillers" },
                { "International TV Shows Romantic TV Shows TV Dramas", "International_TV_Shows_Romantic_TV_Shows_TV_Dramas" },
                { "Language TV Shows", "Language_TV_Shows" },
                { "Musicals", "Musicals" },
                { "Spirituality", "Spirituality" },
                { "Thrillers", "Thrillers" },
                { "Reality TV", "Reality_TV" }
            };

            if (!genreMap.TryGetValue(genre, out var columnName))
            {
                Console.WriteLine("Genre not found in map");
                return BadRequest($"Invalid genre: {genre}");
            }

            try
            {
                var filtered = await _movieContext.movies_titles
                    .Where(m => EF.Property<int>(m, columnName) == 1)
                    .ToListAsync();

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
        [HttpPost("rate-movie")]
        public async Task<IActionResult> RateMovie([FromBody] movies_rating model)
        {
            var existing = await _movieContext.movies_ratings
                .FirstOrDefaultAsync(r => r.user_id == model.user_id && r.show_id == model.show_id);
            if (existing != null)
            {
                existing.rating = model.rating;
            }
            else
            {
                _movieContext.movies_ratings.Add(model);
            }
            await _movieContext.SaveChangesAsync();
            return Ok();
        }
        [HttpGet("average-rating")]
        public async Task<IActionResult> GetAverageRating([FromQuery] string showId)
        {
            var avg = await _movieContext.movies_ratings
                .Where(r => r.show_id == showId && r.rating != null)
                .AverageAsync(r => (double?)r.rating) ?? 0.0;
            return Ok(new { average = avg });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMovie(string id, [FromBody] movies_title updatedMovie)
        {
            if (id != updatedMovie.show_id)
            {
                return BadRequest("ID mismatch between URL and body");
            }

            var existingMovie = await _movieContext.movies_titles.FindAsync(id);
            if (existingMovie == null)
            {
                return NotFound();
            }

            // Update all properties
            _movieContext.Entry(existingMovie).CurrentValues.SetValues(updatedMovie);
            await _movieContext.SaveChangesAsync();

            return Ok(updatedMovie); // Or NoContent() if you don’t need to return the data
        }

    }
}

