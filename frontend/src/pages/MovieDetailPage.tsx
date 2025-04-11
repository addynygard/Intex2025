import { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import StarRating from '../components/StarRating';
import { useParams, useNavigate } from 'react-router-dom';
import ImageLink from '../components/ImageLink';
import Carousel from '../components/Carousel';
import { API_URL } from '../api/movieAPI';
import PageWrapper from '../components/PageWrapper';
import './MovieDetailPage.css';
import StarDisplay from '../components/StarDisplay';
import { Movie } from '../types/Movie';

const MovieDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const userId = 1;
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [clusterRecommendations, setClusterRecommendations] = useState<Movie[]>(
    [],
  );
  const [loadingSimilar, setLoadingSimilar] = useState<boolean>(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieResponse = await axios.get<Movie>(
          `${API_URL}/api/movie/${id}`,
        );
        console.log('Movie details:', movieResponse.data);
        setMovie(movieResponse.data);

        const ratingResponse = await axios.get(
          `${API_URL}/api/movie/user-rating`,
          { params: { userId, showId: id } },
        );
        setUserRating((ratingResponse.data as { rating: number }).rating);
        const averageRatingResponse = await axios.get(
          `${API_URL}/api/movie/average-rating`,
          { params: { showId: movieResponse.data.show_id } },
        );
        setAverageRating(
          (averageRatingResponse.data as { average: number }).average,
        );

        // Fetch cluster recommendations from FastAPI
        // Fetch cluster recommendations from FastAPI
        // const clusterRecResponse = await axios.get<{ title: string }[]>(
        //   `https://recommendation-api-intex2025-bvhebjanhyfbeafy.eastus-01.azurewebsites.net/recommendations/cluster/${userId}`,
        // );

        // // Fetch real metadata for each title using your .NET API
        // const movieMetadataRequests = clusterRecResponse.data.map((rec) =>
        //   axios.get<Movie>(
        //     `${API_URL}/api/movie/title/${encodeURIComponent(rec.title)}`,
        //   ),
        // );

        // const metadataResponses = await Promise.all(movieMetadataRequests);
        // const realMovies: Movie[] = metadataResponses.map((res) => res.data);

        // setClusterRecommendations(realMovies);
        try {
          console.log('📡 Fetching cluster recommendations from FastAPI...');

          const clusterRecResponse = await axios.get<{ title: string }[]>(
            `https://recommendation-api-intex2025-bvhebjanhyfbeafy.eastus-01.azurewebsites.net/recommendations/cluster/${userId}`,
          );

          console.log(
            '✅ Raw cluster titles received:',
            clusterRecResponse.data,
          );

          const movieMetadataRequests = clusterRecResponse.data.map((rec) => {
            const url = `${API_URL}/api/movie/title/${encodeURIComponent(rec.title)}`;
            console.log(
              '🔍 Fetching metadata from .NET for:',
              rec.title,
              '→',
              url,
            );
            return axios.get<Movie>(url).catch((err) => {
              console.error('❌ Failed to fetch metadata for:', rec.title, err);
              return null; // Don't fail the whole batch
            });
          });

          const metadataResponses = await Promise.all(movieMetadataRequests);

          // ✅ Filter out failed (null) or incomplete responses
          const filtered = metadataResponses.filter(
            (res): res is AxiosResponse<Movie> => res !== null && !!res?.data,
          );

          // ✅ Extract just the movie data
          const realMovies: Movie[] = filtered.map((res) => res.data);

          // ✅ Save to state
          setClusterRecommendations(realMovies);
        } catch (err) {
          console.error(
            '🔥 Error fetching cluster recommendations or metadata:',
            err,
          );
        }

        // Fetch similar movies
        if (movieResponse.data.title) {
          const recResponse = await axios.get<Movie[]>(
            `${API_URL}/api/recommendation/similar/${encodeURIComponent(
              movieResponse.data.title,
            )}`,
          );
          setSimilarMovies(recResponse.data);
        }
      } catch (error) {
        console.error(
          'Error fetching movie details or recommendations:',
          error,
        );
      } finally {
        setLoadingSimilar(false);
      }
    };

    fetchMovieDetails();
  }, [id, userId]);

  const handleRating = async (rating: number) => {
    try {
      await axios.post(`${API_URL}/api/movie/rate-movie`, {
        user_id: userId,
        show_id: movie?.show_id,
        rating,
      });
      setUserRating(rating);
      alert(`Thanks for rating this movie ${rating} stars!`);

      const avgResponse = await axios.get(
        `${API_URL}/api/movie/average-rating`,
        { params: { showId: movie?.show_id } },
      );
      setAverageRating(avgResponse.data.average);
    } catch (err) {
      console.error('Failed to submit rating:', err);
      alert('Rating submitted! Thank you!');
    }
  };

  const handleMovieClick = (movieId: string) => {
    navigate(`/movie/${movieId}`);
  };

  if (!movie) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-screen text-white">
          Loading...
        </div>
      </PageWrapper>
    );
  }

  const getGenres = () => {
    if (!movie) return '';
    const genreMap: { [key: string]: string } = {
      action: 'Action',
      adventure: 'Adventure',
      anime_Series_International_TV_Shows: 'Anime / International',
      british_TV_Shows_Docuseries_International_TV_Shows: 'British / Docuseries / International',
      children: 'Children',
      comedies: 'Comedies',
      comedies_Dramas_International_Movies: 'Comedies / Dramas / International',
      comedies_International_Movies: 'Comedies / International',
      comedies_Romantic_Movies: 'Comedies / Romantic',
      crime_TV_Shows_Docuseries: 'Crime / Docuseries',
      documentaries: 'Documentaries',
      documentaries_International_Movies: 'Documentaries / International',
      docuseries: 'Docuseries',
      dramas: 'Dramas',
      dramas_International_Movies: 'Dramas / International',
      dramas_Romantic_Movies: 'Dramas / Romantic',
      family_Movies: 'Family',
      fantasy: 'Fantasy',
      horror_Movies: 'Horror',
      international_Movies_Thrillers: 'Intl. Thrillers',
      international_TV_Shows_Romantic_TV_Shows_TV_Dramas: 'Intl. Romantic TV / Dramas',
      kids_TV: 'Kids TV',
      language_TV_Shows: 'Language TV',
      musicals: 'Musicals',
      nature_TV: 'Nature TV',
      reality_TV: 'Reality TV',
      spirituality: 'Spirituality',
      tV_Action: 'TV Action',
      tV_Comedies: 'TV Comedies',
      tV_Dramas: 'TV Dramas',
      talk_Shows_TV_Comedies: 'Talk Shows / TV Comedies',
      thrillers: 'Thrillers',
    };
  
    return Object.entries(genreMap)
      .filter(([key]) => movie[key as keyof Movie])
      .map(([, label]) => label)
      .join(' / ');
  };
  

  return (
    <PageWrapper>
      <div className="movie-detail-wrapper">
        <div className="movie-detail-content">
          {/* Movie Poster */}
          <div className="movie-poster">
            <ImageLink movieTitle={movie.title} size="large" />
          </div>

          {/* Movie Info */}
          <div className="movie-info">
            <h1 className="text-6xl font-extrabold text-left mb-2">
              {movie.title}
            </h1>

            <p className="text-base text-gray-300 text-left mb-3">
              {movie.release_year} • {movie.rating || 'NR'} •{' '}
              {movie.duration || '??'} •{' '}
              <span className="italic text-purple-400">{movie.type}
              {getGenres() && ` • ${getGenres()}`}

              </span>
            </p>

            <p className="text-lg text-left leading-relaxed mb-5">
              {movie.description}
            </p>

            <div className="movie-buttons mb-6">
              <button className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-300 transition">
                ▶ Play
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-full font-semibold transition">
                Trailer
              </button>
            </div>

            {/* :star: Average Rating */}
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-1">Average Rating</h3>
              <StarDisplay rating={averageRating} />
            </div>
            <div className="mb-2 text-left w-full">
              <h3 className="text-lg font-semibold mb-1 text-left">
                Rate this movie:
              </h3>
              <StarRating onRate={handleRating} initialRating={userRating} />
            </div>
          </div>
        </div>

        {/* Carousel Section – Similar Movies */}
        <div className="movie-carousel-section">
          {loadingSimilar ? (
            <p className="text-gray-400 italic">Loading similar movies...</p>
          ) : similarMovies.length > 0 ? (
            <Carousel
              genre="Similar Movies"
              movies={similarMovies}
              onMovieClick={handleMovieClick}
            />
          ) : (
            <p className="text-gray-500 italic">
              No similar movies found for this title.
            </p>
          )}
          {/* Carousel Section – Cluster Recommendations */}
          {clusterRecommendations.length > 0 && (
            <div className="movie-carousel-section">
              <Carousel
                genre="You May Also Like"
                movies={clusterRecommendations}
                onMovieClick={handleMovieClick}
              />
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default MovieDetailPage;
