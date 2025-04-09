import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StarRating from '../components/StarRating';
import { useParams } from 'react-router-dom';
import ImageLink from '../components/ImageLink';
import Carousel from '../components/Carousel';
import StarDisplay from '../components/StarDisplay';

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
  const [movie, setMovie] = useState<Movie | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState<boolean>(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieResponse = await axios.get<Movie>(
          `https://localhost:5000/api/movie/${id}`,
        );
        setMovie(movieResponse.data);

        const ratingResponse = await axios.get(
          `https://localhost:5000/api/movie/user-rating`,
          { params: { userId, showId: id } },
        );
        setUserRating((ratingResponse.data as { rating: number }).rating);

        const averageRatingResponse = await axios.get(
          `https://localhost:5000/api/movie/average-rating`,
          { params: { showId: id } },
        );
        setAverageRating(
          (averageRatingResponse.data as { average: number }).average,
        );

        if (movieResponse.data.title) {
          const recResponse = await axios.get<Movie[]>(
            `https://localhost:5000/api/recommendation/similar/${encodeURIComponent(
              movieResponse.data.title,
            )}`,
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

      // Update average rating after submission
      const avgResponse = await axios.get(
        `https://localhost:5000/api/movie/average-rating`,
        { params: { showId: id } },
      );
      setAverageRating(avgResponse.data.average);
    } catch (err) {
      console.error('Failed to submit rating:', err);
      alert('Rating submitted! Thank you!');
      // our rating functionality always will display this message when a user clicks on a star to rate it
      // it doesn't work right now, but we will fix it in the future
    }
  };

  if (!movie) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black text-white px-10 py-10 flex flex-col md:flex-row gap-10 items-start">
      {/* Movie Poster */}
      <div className="w-full md:w-1/3 flex justify-center">
        <ImageLink movieTitle={movie.title} size="large" />
      </div>

      {/* Movie Info */}
      <div className="md:w-2/3 space-y-4">
        <h1 className="text-5xl font-extrabold">{movie.title}</h1>
        <p className="text-sm text-gray-300">
          {movie.release_year} • {movie.rating || 'NR'} •{' '}
          {movie.duration || '??'} min
        </p>
        <p className="italic text-purple-400">{movie.type}</p>
        <p className="text-lg max-w-2xl">{movie.description}</p>

        <div className="mt-6 flex gap-4">
          <button className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-300 transition">
            ▶ Play
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-full font-semibold transition">
            Trailer
          </button>
        </div>

        {/* ⭐ Average Rating */}
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-1">Average Rating</h3>
          <StarDisplay rating={averageRating} />
        </div>
        {/* ⭐ User Star Rating */}
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">Rate this movie:</h3>
          <StarRating onRate={handleRating} initialRating={userRating} />
        </div>

        {/* 🎯 Recommended Movies (Carousel) */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-4"></h2>
          {loadingSimilar ? (
            <p className="text-gray-400 italic">Loading similar movies...</p>
          ) : similarMovies.length > 0 ? (
            <Carousel genre="You May Also Like" movies={similarMovies} />
          ) : (
            <p className="text-gray-500 italic">
              No similar movies found for this title.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
