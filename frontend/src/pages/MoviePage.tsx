import React, { useEffect, useState } from 'react';
import './MoviePage.css';
import { Movie } from '../types/Movie';
import Carousel from '../components/Carousel';
import TopCarousel from '../components/TopCarousel';
import { useUser } from '../context/UserContext';

const MoviePage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [userRecs, setUserRecs] = useState<Movie[]>([]);
  const { userId } = useUser(); // making it dynamic

  // 🔁 Load all regular movies (for genre filters)
  useEffect(() => {
    async function fetchMovies() {
      const response = await fetch('/api/movies');
      const data = await response.json();
      setMovies(data);
    }

    fetchMovies();
  }, []);

  // 🔥 Fetch Top Rated
  useEffect(() => {
    async function fetchTopRated() {
      try {
        const response = await fetch(
          'https://localhost:5000/api/recommendation/top-rated',
        );
        const data = await response.json();
        setTopRated(data);
      } catch (error) {
        console.error('Failed to fetch top rated movies:', error);
      }
    }

    fetchTopRated();
  }, []);

  // 🎯 Fetch User Recommendations
  useEffect(() => {
    async function fetchUserRecs() {
      try {
        const response = await fetch(
          `https://localhost:5000/api/recommendation/user/${userId}`,
        );
        const data = await response.json();
        setUserRecs(data);
      } catch (error) {
        console.error('Failed to fetch user recommendations:', error);
      }
    }

    fetchUserRecs();
  }, [userId]);

  // 🎬 Genre filtering
  const actionMovies = movies.filter((movie) => movie.action);
  const comedyMovies = movies.filter((movie) => movie.comedies);
  const dramaMovies = movies.filter((movie) => movie.dramas);

  return (
    <>
      <TopCarousel />
      <div className="movie-page">
        <h1>Welcome to Your Movie Library</h1>

        {/* 🎯 User-Based Recommendations */}
        {userRecs.length > 0 && (
          <Carousel genre="You May Like These" movies={userRecs} />
        )}

        {/* 🏆 Top Rated */}
        {topRated.length > 0 && (
          <Carousel genre="Top Rated Movies" movies={topRated} />
        )}

        {/* 🎬 Genre Sections */}
        <Carousel genre="Action Picks" movies={actionMovies} />
        <Carousel genre="Laugh Out Loud" movies={comedyMovies} />
        <Carousel genre="Deep Dramas" movies={dramaMovies} />
      </div>
    </>
  );
};

export default MoviePage;
