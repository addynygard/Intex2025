import React, { useEffect, useRef, useState } from 'react';
import './TopCarousel.css';
import { Movie } from '../types/Movie';
import ImageLink from './ImageLink';

interface TopCarouselProps {
  items: Movie[]; // Accepts real movie data
}

const TopCarousel: React.FC<TopCarouselProps> = ({ items }) => {
  const visibleSlides = 3;
  const totalSlides = items.length;
  const extendedItems = [
    ...items.slice(-visibleSlides), // Clone end
    ...items,
    ...items.slice(0, visibleSlides), // Clone start
  ];

  const [currentIndex, setCurrentIndex] = useState(visibleSlides);
  const trackRef = useRef<HTMLDivElement>(null);

  const slideWidth = () => {
    const container = trackRef.current?.parentElement;
    return container ? container.offsetWidth / visibleSlides : 0;
  };

  const moveToSlide = (index: number, withTransition: boolean = true) => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transition = withTransition
      ? 'transform 0.5s ease-in-out'
      : 'none';
    const offset = slideWidth() * index;
    track.style.transform = `translateX(-${offset}px)`;
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      const next = prev + 1;
      moveToSlide(next);
      return next;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      const next = prev - 1;
      moveToSlide(next);
      return next;
    });
  };

  const handleTransitionEnd = () => {
    if (currentIndex >= totalSlides + visibleSlides) {
      const resetIndex = visibleSlides;
      setCurrentIndex(resetIndex);
      moveToSlide(resetIndex, false);
    } else if (currentIndex <= visibleSlides - 1) {
      const resetIndex = totalSlides + visibleSlides - 1;
      setCurrentIndex(resetIndex);
      moveToSlide(resetIndex, false);
    }
  };

  useEffect(() => {
    moveToSlide(currentIndex, false);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="top-carousel-wrapper">
      <button className="carousel-arrow left" onClick={prevSlide}>
        ◀
      </button>
      <div className="top-carousel-track">
        <div
          className="top-carousel"
          ref={trackRef}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedItems.map((movie, i) => (
            <div className="carousel-slide" key={i}>
              <ImageLink movieTitle={movie.title} size="large" />
              <div className="carousel-movie-title">{movie.title}</div>
            </div>
          ))}
        </div>
      </div>
      <button className="carousel-arrow right" onClick={nextSlide}>
        ▶
      </button>
    </div>
  );
};

export default TopCarousel;
