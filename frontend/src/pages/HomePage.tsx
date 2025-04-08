import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import ImageLink from '../components/ImageLink';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function HomePage() {
  const navigate = useNavigate();

  const testMovieTitles = [
    'Animal Crackers',
    '1 Chance 2 Dance',
    '1 Mile to You',
    'Bee Movie',
    'Pajanimals',
    'PJ Masks',
    'Ella Enchanted',
    'Flushed Away',
    'Gnomeo & Juliet',
    "Howl's Moving Castle",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const lastInteractionTime = useRef<number>(Date.now());

  // ⏳ Controls auto-slide timing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
  
    const scheduleNext = () => {
      timeoutId = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testMovieTitles.length);
        scheduleNext(); // schedule the next slide
      }, 4000);
    };
  
    scheduleNext();
  
    return () => clearTimeout(timeoutId);
  }, []);
  
  const goLeft = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testMovieTitles.length - 1 : prevIndex - 1,
    );
    lastInteractionTime.current = Date.now(); // update interaction time
  };

  const goRight = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testMovieTitles.length);
    lastInteractionTime.current = Date.now(); // update interaction time
  };

  const currentTitle = testMovieTitles[currentIndex];

  return (
    <div className="main-container home-layout">
      <div className="home-left">
        <h1 className="text-center home-title">🎬 CinaNiche</h1>
        <p className="text-center home-subtitle">
          Your personalized movie platform
        </p>

        <div className="home-description">
          <p>
            Discover movies tailored to your taste, explore niche genres, and
            connect with fellow movie lovers by logging in or creating a free
            account.
          </p>
        </div>

        <div className="card home-actions">
          <p className="text-center">
            Join us now and start your cinematic journey!
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/CreateAccount')}
          >
            Get Started
          </button>
          <p>Already have an account?</p>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/Login')}
          >
            Login
          </button>
        </div>
      </div>

      <div className="home-right">
        <h2 className="text-center home-image-title">Top Trending Movies</h2>
        <div className="featured-movie-wrapper">
          <button className="arrow-btn" onClick={goLeft}>
            <FaChevronLeft />
          </button>

          <div className="featured-movie-content">
            <ImageLink movieTitle={currentTitle} size="large" />
            <p className="movie-title-text">{currentTitle}</p>
          </div>

          <button className="arrow-btn" onClick={goRight}>
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
