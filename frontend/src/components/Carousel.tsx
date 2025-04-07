import React, { useRef } from 'react';
import { Movie } from '../types/Movie';
import './Carousel.css'; // Create a new CSS file for carousel-specific styles
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface CarouselProps {
  genre: string;
  movies: Movie[];
}

const Carousel: React.FC<CarouselProps> = ({ genre, movies }) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft -= 220; // Adjust this to control the scroll speed
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft += 220; // Adjust this to control the scroll speed
    }
  };

  return (
    <div className="carousel">
      <h2>{genre}</h2>
      <div className="carousel-controls">
        <button className="carousel-arrow left" onClick={scrollLeft}>
          <FaChevronLeft />
        </button>{' '}
        <div className="carousel-container" ref={carouselRef}>
          {movies.map((movie) => (
            <div key={movie.show_id} className="movie-item">
              <div className="movie-image-placeholder">
                {/* Placeholder image */}
                <img
                  src="https://via.placeholder.com/200x300"
                  alt={movie.title}
                />
              </div>
              <div className="movie-title">{movie.title}</div>
            </div>
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
