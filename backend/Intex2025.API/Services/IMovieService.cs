using Intex2025.API.Models;

public interface IMovieService
{
    Task<List<movies_title>> GetMoviesByTitlesAsync(IEnumerable<string> titles);

    Task<movies_title?> GetMovieByTitleAsync(string title);


}
