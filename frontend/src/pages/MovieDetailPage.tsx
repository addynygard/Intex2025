import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StarRating from '../components/StarRating';

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
  const id = 's100'; // Your current show_id
  const userId = 1; // Replace with dynamic user ID if needed
  const [movie, setMovie] = useState<Movie | null>(null);
  const [userRating, setUserRating] = useState<number>(0);

  useEffect(() => {
    axios
      .get<Movie>(`https://localhost:5000/api/movie/${id}`)
      .then((res) => setMovie(res.data))
      .catch((err) => console.error('Failed to load movie', err));

    // Load existing rating (optional)
    axios
      .get(`https://localhost:5000/api/movie/user-rating`, {
        params: { userId, showId: id },
      })
      .then((res) => {
        setUserRating((res.data as { rating: number }).rating);
      })
      .catch(() => {
        // No existing rating — totally fine
      });
  }, [id]);

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
        <img
          src="/Beynelmilel.jpg"
          alt={`${movie.title} Poster`}
          className="rounded-2xl shadow-lg max-w-xs w-full object-cover"
        />
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

        {/* ⭐ Star Rating */}
        <div className="mt-10">
          <h3 className="text-xl font-bold mb-2">Rate this movie:</h3>
          <StarRating onRate={handleRating} initialRating={userRating} />
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
