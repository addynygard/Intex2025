import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StarRating from '../components/StarRating';
import { useParams, useNavigate } from 'react-router-dom';
import ImageLink from '../components/ImageLink';
import Carousel from '../components/Carousel';
import PageWrapper from '../components/PageWrapper'; // ✅ Add this
import './MovieDetailPage.css';


interface Movie {
  show_id: string;
  title: string;
  release_year: number;
  rating: string;
  duration: string;
  description: string;
  type: string;
  [key: string]: string | number | undefined;
}

const MovieDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const userId = 1;
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState<boolean>(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieResponse = await axios.get<Movie>(
          `https://localhost:5000/api/movie/${id}`
        );
        setMovie(movieResponse.data);

        const ratingResponse = await axios.get(
          `https://localhost:5000/api/movie/user-rating`,
          { params: { userId, showId: id } }
        );
        setUserRating((ratingResponse.data as { rating: number }).rating);

        if (movieResponse.data.title) {
          const recResponse = await axios.get<Movie[]>(
            `https://localhost:5000/api/recommendation/similar/${encodeURIComponent(
              movieResponse.data.title
            )}`
          );
          setSimilarMovies(recResponse.data);
        }
      } catch (error) {
        console.error('Error fetching movie details or similar movies:', error);
      } finally {
        setLoadingSimilar(false);
      }
    };

    fetchMovieDetails();
  }, [id, userId]);

  const handleRating = async (rating: number) => {
    try {
      await axios.post('https://localhost:5000/api/movie/rate-movie', {
        user_id: userId,
        show_id: id,
        rating,
      });
      setUserRating(rating);
      alert(`Thanks for rating this movie ${rating} stars!`);
    } catch (err) {
      console.error('Failed to submit rating:', err);
      alert('Failed to submit rating.');
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
      <h1 className="text-5xl font-extrabold text-left">{movie.title}</h1>


      <p className="text-sm text-gray-300 text-left">

          {movie.release_year} • {movie.rating || 'NR'} • {movie.duration || '??'} •{' '}
          <span className="italic text-purple-400">{movie.type}</span>
        </p>

        <p className="text-lg">{movie.description}</p>

        <div className="movie-buttons">
          <button className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-300 transition">
            ▶ Play
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-full font-semibold transition">
            Trailer
          </button>
        </div>

        <div>
        <h3 className="text-md font-semibold mt-2 mb-1 text-left">Rate this movie:</h3>

          <StarRating onRate={handleRating} initialRating={userRating} />
        </div>

      </div>
    </div>

    {/* 🎯 Carousel Section – now outside of the flex box */}
    <div className="movie-carousel-section">
      {loadingSimilar ? (
        <p className="text-gray-400 italic">Loading similar movies...</p>
      ) : similarMovies.length > 0 ? (
        <Carousel
          genre="You May Also Like"
          movies={similarMovies}
          onMovieClick={handleMovieClick}
        />
      ) : (
        <p className="text-gray-500 italic">No similar movies found for this title.</p>
      )}
    </div>
  </div>
</PageWrapper>


  );
};

export default MovieDetailPage;
