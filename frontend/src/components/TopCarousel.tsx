import React, { useEffect, useRef, useState } from 'react';
import './TopCarousel.css';
import { Movie } from '../types/Movie';
import ImageLink from './ImageLink';
import { Link } from 'react-router-dom';

interface TopCarouselProps {
  items: Movie[];
}

const TopCarousel: React.FC<TopCarouselProps> = ({ items }) => {
  const visibleSlides = 3;
  const totalSlides = items.length;

  // Clone extra slides at start and end for infinite loop effect
  const extendedItems = [
    ...items.slice(-visibleSlides),
    ...items,
    ...items.slice(0, visibleSlides),
  ];

  const [currentIndex, setCurrentIndex] = useState(visibleSlides);
  const trackRef = useRef<HTMLDivElement>(null);

  // Calculate slide width based on visibleSlides
  const slideWidth = () => {
    const container = trackRef.current?.parentElement;
    return container ? container.offsetWidth / visibleSlides : 0;
  };

  // Slide the carousel to a specific index
  const moveToSlide = (index: number, withTransition: boolean = true) => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transition = withTransition
      ? 'transform 0.5s ease-in-out'
      : 'none';
    const offset = slideWidth() * index;
    track.style.transform = `translateX(-${offset}px)`;
  };

  // ⬅ Previous slide
  const prevSlide = () => {
    const prev = currentIndex - 1;
    setCurrentIndex(prev);
    moveToSlide(prev);
  };

  // ➡ Next slide
  const nextSlide = () => {
    const next = currentIndex + 1;
    setCurrentIndex(next);
    moveToSlide(next);
  };

  // 🔄 Handle looping logic when transition ends
  const handleTransitionEnd = () => {
    if (currentIndex >= totalSlides + visibleSlides) {
      const resetIndex = visibleSlides;
      // Use requestAnimationFrame to prevent visual jump
      requestAnimationFrame(() => {
        moveToSlide(resetIndex, false);
        setCurrentIndex(resetIndex);
      });
    } else if (currentIndex <= visibleSlides - 1) {
      const resetIndex = totalSlides + visibleSlides - 1;
      requestAnimationFrame(() => {
        moveToSlide(resetIndex, false);
        setCurrentIndex(resetIndex);
      });
    }
  };

  // On mount, set the initial position without animation
  useEffect(() => {
    moveToSlide(currentIndex, false);
  }, []);

  // Set up auto-rotation once (⏱️)
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval); // cleanup
  }, []); // ← note: empty dependency array!

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
              <Link to={`/movie/${movie.show_id}`}>
                <div className="carousel-slide-content">
                  <ImageLink movieTitle={movie.title} size="large" />
                  <div className="carousel-movie-title">{movie.title}</div>
                </div>
              </Link>
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
