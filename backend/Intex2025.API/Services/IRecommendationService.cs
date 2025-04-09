using System.Collections.Generic;
using System.Threading.Tasks;
using Intex2025.API.Models;

public interface IRecommendationService
{
    Task<List<movies_title>> GetSimilarMoviesAsync(string title);
    Task<List<movies_title>> GetTopRatedMoviesAsync();
    Task<List<movies_title>> GetTopByGenreAsync(string genre);
    Task<List<movies_title>> GetUserRecommendationsAsync(int userId);
}