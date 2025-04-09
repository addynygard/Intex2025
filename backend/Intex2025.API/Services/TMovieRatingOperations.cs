using Intex2025.API.Data;
using Intex2025.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Intex2025.API.Services;

public class TMovieRatingOperations
{
    private readonly MovieDbContext _context;

    public TMovieRatingOperations(MovieDbContext context)
    {
        _context = context;
    }

    public async Task RateMovieAsync(int userId, string showId, int rating)
    {
        var existing = await _context.movies_ratings
            .FirstOrDefaultAsync(r => r.user_id == userId && r.show_id == showId);

        if (existing != null)
        {
            existing.rating = rating;
        }
        else
        {
            _context.movies_ratings.Add(new movies_rating
            {
                user_id = userId,
                show_id = showId,
                rating = rating
            });
        }

        await _context.SaveChangesAsync();
    }

    public async Task<int?> GetUserRatingAsync(int userId, string showId)
    {
        return await _context.movies_ratings
            .Where(r => r.user_id == userId && r.show_id == showId)
            .Select(r => r.rating)
            .FirstOrDefaultAsync();
    }

    public async Task<double> GetAverageRatingAsync(string showId)
    {
        return await _context.movies_ratings
            .Where(r => r.show_id == showId && r.rating != null)
            .AverageAsync(r => (double?)r.rating) ?? 0.0;
    }
}
