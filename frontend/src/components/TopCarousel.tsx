import React, { useEffect, useRef, useState } from 'react';
import './TopCarousel.css';

const placeholderImages = [
  'https://via.placeholder.com/500x700?text=1',
  'https://via.placeholder.com/500x700?text=2',
  'https://via.placeholder.com/500x700?text=3',
  'https://via.placeholder.com/500x700?text=4',
  'https://via.placeholder.com/500x700?text=5',
  'https://via.placeholder.com/500x700?text=6',
];

const TopCarousel = () => {
  const visibleSlides = 3;
  const totalSlides = placeholderImages.length;
  const extendedImages = [
    ...placeholderImages.slice(-visibleSlides), // Clone end
    ...placeholderImages,
    ...placeholderImages.slice(0, visibleSlides), // Clone start
  ];

  const [currentIndex, setCurrentIndex] = useState(visibleSlides); // Start on first real slide
  const trackRef = useRef<HTMLDivElement>(null);

  const slideWidth = () => {
    const container = trackRef.current?.parentElement;
    return container ? container.offsetWidth / visibleSlides : 0;
  };

  const moveToSlide = (index: number, withTransition: boolean = true) => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transition = withTransition ? 'transform 0.5s ease-in-out' : 'none';
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

  // Set initial position on mount
  useEffect(() => {
    moveToSlide(currentIndex, false);
  }, []);

  // Auto-scroll by 1 every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="top-carousel-wrapper">
      <button className="carousel-arrow left" onClick={prevSlide}>◀</button>
      <div className="top-carousel-track">
        <div
          className="top-carousel"
          ref={trackRef}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedImages.map((src, i) => (
            <div className="carousel-slide" key={i}>
              <img src={src} alt={`Slide ${i + 1}`} />
            </div>
          ))}
        </div>
      </div>
      <button className="carousel-arrow right" onClick={nextSlide}>▶</button>
    </div>
  );
};

export default TopCarousel;
