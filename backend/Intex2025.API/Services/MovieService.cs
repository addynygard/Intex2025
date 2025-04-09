using Intex2025.API.Data;
using Intex2025.API.Models;
using Microsoft.EntityFrameworkCore;

public class MovieService : IMovieService
{
    private readonly MovieDbContext _context;

    public MovieService(MovieDbContext context)
    {
        _context = context;
    }

    public async Task<List<movies_title>> GetMoviesByTitlesAsync(IEnumerable<string> titles)
{
    var lowerTitles = titles.Select(t => t.ToLower()).ToList();
    
    return await _context.movies_titles
        .Where(m => lowerTitles.Contains(m.title.ToLower()))
        .ToListAsync();
}
}

