import React, { useEffect, useState } from 'react';
import './MoviePage.css'; // Your main page CSS file
import { Movie } from '../types/Movie';
import Carousel from '../components/Carousel'; // Import the Carousel component
import Header from '../components/Header'; // Import your header component
import Footer from '../components/Footer'; // Import your footer component

const MoviePage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  // Example fetching movies (you can adjust the fetching mechanism to your needs)
  useEffect(() => {
    async function fetchMovies() {
      const response = await fetch('/api/movies'); // Adjust your API endpoint
      const data = await response.json();
      setMovies(data);
    }

    fetchMovies();
  }, []);

  // Filter movies by genre
  const actionMovies = movies.filter((movie) => movie.action);
  const comedyMovies = movies.filter((movie) => movie.comedies);
  const dramaMovies = movies.filter((movie) => movie.dramas);

  return (
    <>
      <Header />
      <div className="movie-page">
        <h1>Welcome to Your Movie Library</h1>

        {/* Use the Carousel component */}
        <Carousel genre="Action" movies={actionMovies} />
        <Carousel genre="Comedy" movies={comedyMovies} />
        <Carousel genre="Drama" movies={dramaMovies} />

        {/* Add more carousels as needed */}
      </div>
      <Footer />
    </>
  );
};

export default MoviePage;
