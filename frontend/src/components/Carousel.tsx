import React, { useRef } from 'react';
import { Movie } from '../types/Movie';
import './Carousel.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ImageLink from './ImageLink';
import { Link } from 'react-router-dom';

interface CarouselProps {
  genre: string;
  movies: Movie[];
  onMovieClick: (movieId: string) => void; // Add this property
}

interface CarouselProps {
  genre: string;
  movies: Movie[];
  minimal?: boolean;
}

const Carousel: React.FC<CarouselProps> = ({ genre, movies }) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft -= 220;
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft += 220;
    }
  };

  return (
    <div className="carousel">
      <h2>{genre}</h2>
      <div className="carousel-controls">
        <button className="carousel-arrow left" onClick={scrollLeft}>
          <FaChevronLeft />
        </button>
        <div className="carousel-container" ref={carouselRef}>
          {movies.map((movie) => (
            <Link to={`/movie/${movie.show_id}`} key={movie.show_id}>
              <div className="movie-item">
                <div className="movie-image">
                  <ImageLink movieTitle={movie.title} size="medium" />
                </div>
                <div className="movie-title">{movie.title}</div>
              </div>
            </Link>
          ))}
        </div>
        <button className="carousel-arrow right" onClick={scrollRight}>
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Carousel;
