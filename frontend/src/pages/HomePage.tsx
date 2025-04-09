import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import ImageLink from '../components/ImageLink';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { API_URL } from '../api/movieAPI';

interface Movie {
  show_id: string;
  title: string;
  release_year: number;
  rating: string;
  duration: string;
  description: string;
  type: string;
}

function HomePage() {
  const navigate = useNavigate();
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const lastInteractionTime = useRef<number>(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  // ✅ Fetch top-rated movies on load
  useEffect(() => {
    axios
      .get<Movie[]>(`${API_URL}/api/recommendation/top-rated`)
      .then((res) => {
        setTopRated(res.data);
      })
      .catch((err) => {
        console.error('Failed to load top rated movies', err);
      });
  }, []);

  // ⏳ Auto-slide logic
  useEffect(() => {
    const resetAutoAdvance = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prevIndex) =>
          topRated.length ? (prevIndex + 1) % topRated.length : 0,
        );
        resetAutoAdvance(); // keep it going
      }, 6000); // resume after a 6s pause
    };

    if (topRated.length) {
      resetAutoAdvance(); // start the cycle
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [topRated]);

  const goLeft = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? topRated.length - 1 : prevIndex - 1,
    );
    lastInteractionTime.current = Date.now();
  };

  const goRight = () => {
    setCurrentIndex((prevIndex) =>
      topRated.length ? (prevIndex + 1) % topRated.length : 0,
    );
    lastInteractionTime.current = Date.now();
  };

  const currentMovie = topRated[currentIndex];

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
            {currentMovie && (
              <Link to={`/movie/${currentMovie.show_id}`}>
                <ImageLink movieTitle={currentMovie.title} size="large" />
                <p className="movie-title-text mt-2 text-white text-xl font-semibold">
                  {currentMovie.title}
                </p>
              </Link>
            )}
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
