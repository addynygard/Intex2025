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

}
