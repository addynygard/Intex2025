using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Intex2025.API.Models;
using Microsoft.EntityFrameworkCore;
using Intex2025.API.Data;

namespace Intex2025.API.Controllers;

[Route("api/[controller]")]
[ApiController]
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

    // Filter out anything that has any genre value set to 1
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
    { "Anime Series International TV Shows", "anime_series_international_tv_shows" },
    { "British TV Shows Docuseries International TV Shows", "british_tv_shows_docuseries_international_tv_shows" },
    { "Children", "children" },
    { "Comedies", "comedies" },
    { "Comedies Dramas International Movies", "comedies_dramas_international_movies" },
    { "Comedies International Movies", "comedies_international_movies" },
    { "Comedies Romantic Movies", "comedies_romantic_movies" },
    { "Crime TV Shows Docuseries", "crime_tv_shows_docuseries" },
    { "Documentaries", "documentaries" },
    { "Documentaries International Movies", "documentaries_international_movies" },
    { "Docuseries", "docuseries" },
    { "Dramas", "dramas" },
    { "Dramas International Movies", "dramas_international_movies" },
    { "Dramas Romantic Movies", "dramas_romantic_movies" },
    { "Family Movies", "family_movies" },
    { "Fantasy", "fantasy" },
    { "Horror Movies", "horror_movies" },
    { "International Movies Thrillers", "international_movies_thrillers" },
    { "International TV Shows Romantic TV Shows TV Dramas", "international_tv_shows_romantic_tv_shows_tv_dramas" },
    { "Kids' TV", "kids'_tv" },
    { "Language TV Shows", "language_tv_shows" },
    { "Musicals", "musicals" },
    { "Nature TV", "nature_tv" },
    { "Reality TV", "reality_tv" },
    { "Spirituality", "spirituality" },
    { "TV Action", "tv_action" },
    { "TV Comedies", "tv_comedies" },
    { "TV Dramas", "tv_dramas" },
    { "Talk Shows TV Comedies", "talk_shows_tv_comedies" },
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
    case "adventure":
        query = query.Where(m => m.Adventure == 1);
        break;
    case "anime_series_international_tv_shows":
        query = query.Where(m => m.Anime_Series_International_TV_Shows == 1);
        break;
    case "british_tv_shows_docuseries_international_tv_shows":
        query = query.Where(m => m.British_TV_Shows_Docuseries_International_TV_Shows == 1);
        break;
    case "children":
        query = query.Where(m => m.Children == 1);
        break;
    case "comedies":
        query = query.Where(m => m.Comedies == 1);
        break;
    case "comedies_dramas_international_movies":
        query = query.Where(m => m.Comedies_Dramas_International_Movies == 1);
        break;
    case "comedies_international_movies":
        query = query.Where(m => m.Comedies_International_Movies == 1);
        break;
    case "comedies_romantic_movies":
        query = query.Where(m => m.Comedies_Romantic_Movies == 1);
        break;
    case "crime_tv_shows_docuseries":
        query = query.Where(m => m.Crime_TV_Shows_Docuseries == 1);
        break;
    case "documentaries":
        query = query.Where(m => m.Documentaries == 1);
        break;
    case "documentaries_international_movies":
        query = query.Where(m => m.Documentaries_International_Movies == 1);
        break;
    case "docuseries":
        query = query.Where(m => m.Docuseries == 1);
        break;
    case "dramas":
        query = query.Where(m => m.Dramas == 1);
        break;
    case "dramas_international_movies":
        query = query.Where(m => m.Dramas_International_Movies == 1);
        break;
    case "dramas_romantic_movies":
        query = query.Where(m => m.Dramas_Romantic_Movies == 1);
        break;
    case "family_movies":
        query = query.Where(m => m.Family_Movies == 1);
        break;
    case "fantasy":
        query = query.Where(m => m.Fantasy == 1);
        break;
    case "horror_movies":
        query = query.Where(m => m.Horror_Movies == 1);
        break;
    case "international_movies_thrillers":
        query = query.Where(m => m.International_Movies_Thrillers == 1);
        break;
    case "international_tv_shows_romantic_tv_shows_tv_dramas":
        query = query.Where(m => m.International_TV_Shows_Romantic_TV_Shows_TV_Dramas == 1);
        break;
    case "kids'_tv":
        query = query.Where(m => m.Kids__TV == 1);
        break;
    case "language_tv_shows":
        query = query.Where(m => m.Language_TV_Shows == 1);
        break;
    case "musicals":
        query = query.Where(m => m.Musicals == 1);
        break;
    case "nature_tv":
        query = query.Where(m => m.Nature_TV == 1);
        break;
    case "reality_tv":
        query = query.Where(m => m.Reality_TV == 1);
        break;
    case "spirituality":
        query = query.Where(m => m.Spirituality == 1);
        break;
    case "tv_action":
        query = query.Where(m => m.TV_Action == 1);
        break;
    case "tv_comedies":
        query = query.Where(m => m.TV_Comedies == 1);
        break;
    case "tv_dramas":
        query = query.Where(m => m.TV_Dramas == 1);
        break;
    case "talk_shows_tv_comedies":
        query = query.Where(m => m.Talk_Shows_TV_Comedies == 1);
        break;
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
            Console.WriteLine(ex.ToString()); // print full stack trace
            return StatusCode(500, "Internal Server Error: " + ex.Message);
        }

}


    // GET: api/movie/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<movies_title>> GetMovie(string id)
    {
        var movie = await _movieContext.movies_titles.FindAsync(id);
        if (movie == null)
            return NotFound();

        return movie;
    }

    // POST: api/movie (Admin only)
    [HttpPost]
    //[Authorize(Roles = "admin")]
    public async Task<ActionResult<movies_title>> CreateMovie(movies_title movie)
    {
        _movieContext.movies_titles.Add(movie);
        await _movieContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMovie), new { id = movie.show_id }, movie);
    }

    // PUT: api/movie/{id} (Admin only)
    [HttpPut("{id}")]
    //[Authorize(Roles = "admin")]
    public async Task<IActionResult> UpdateMovie(string id, movies_title updatedMovie)
    {
        if (id != updatedMovie.show_id)
            return BadRequest();

        _movieContext.Entry(updatedMovie).State = EntityState.Modified;

        try
        {
            await _movieContext.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_movieContext.movies_titles.Any(e => e.show_id == id))
                return NotFound();
            throw;
        }

        return NoContent();
    }

    // DELETE: api/movie/{id} (Admin only)
    [HttpDelete("{id}")]
    //[Authorize(Roles = "admin")]
    public async Task<IActionResult> DeleteMovie(string id)
    {
        var movie = await _movieContext.movies_titles.FindAsync(id);
        if (movie == null)
            return NotFound();

        _movieContext.movies_titles.Remove(movie);
        await _movieContext.SaveChangesAsync();

        return NoContent();
    }




    //// GET: api/movie/user/role
    //[HttpGet("user/role")]
    //[Authorize] // Ensure the user is authenticated
    //public async Task<ActionResult<string>> GetUserRole()
    //{
    //    // Extract the user ID from claims
    //    var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "user_id")?.Value;
    //    if (userIdClaim == null)
    //    {
    //        return Unauthorized(new { error = "User not authenticated" });
    //    }

    //    // Convert user ID to int
    //    if (!int.TryParse(userIdClaim, out var parsedUserId))
    //    {
    //        return BadRequest(new { error = "Invalid user ID format" });
    //    }

    //    // Fetch the user's role from the database
    //    var role = await _movieContext.movies_users
    //        .Where(mu => mu.user_id == parsedUserId)
    //        .Select(mu => mu.role)
    //        .FirstOrDefaultAsync();

    //    if (role == null)
    //    {
    //        return NotFound(new { error = "User role not found" });
    //    }

    //    return Ok(new { role });
    //}

    [HttpPost("rate-movie")]
    public async Task<IActionResult> RateMovie([FromBody] movies_rating newRating)
    {
        if (newRating.user_id == null || newRating.show_id == null || newRating.rating == null)
        {
            return BadRequest("user_id, show_id, and rating are required.");
        }

        try
        {
            var existingRating = await _movieContext.movies_ratings
                .FirstOrDefaultAsync(r => r.user_id == newRating.user_id && r.show_id == newRating.show_id);

            if (existingRating != null)
            {
                existingRating.rating = newRating.rating;
                _movieContext.movies_ratings.Update(existingRating);
            }
            else
            {
                _movieContext.movies_ratings.Add(newRating);
            }

            await _movieContext.SaveChangesAsync();
            return Ok(new { message = "Rating saved successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }



}
