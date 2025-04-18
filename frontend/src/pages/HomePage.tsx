import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import ImageLink from '../components/ImageLink';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { API_URL } from '../api/movieAPI';
import './HomePage.css';
import Logo from '../assets/cinenichelogo.png';

interface Movie {
  show_id: string;
  title: string;
  release_year: number;
  rating: string;
  duration: string;
  description: string;
  type: string;
}

function HomePage({ language }: { language: string }) {
  const navigate = useNavigate();
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const lastInteractionTime = useRef<number>(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    axios
      .get<Movie[]>(`${API_URL}/api/recommendation/top-rated`, {
        withCredentials: true,
      })
      .then((res) => {
        setTopRated(res.data);
      })
      .catch((err) => {
        console.error('Failed to load top rated movies', err);
      });
  }, []);

  useEffect(() => {
    const resetAutoAdvance = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prevIndex) =>
          topRated.length ? (prevIndex + 1) % topRated.length : 0,
        );
        resetAutoAdvance();
      }, 6000);
    };

    if (topRated.length) {
      resetAutoAdvance();
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
        <img src={Logo} alt="CineNiche Logo" className="home-logo" />

        <p className="home-subtitle">
          {language === 'en'
            ? 'Your personalized movie platform'
            : 'Tu plataforma de películas personalizada'}
        </p>

        <div className="home-description">
          <p>
            {language === 'en'
              ? 'Discover movies tailored to your taste, explore niche genres, and connect with fellow movie lovers by logging in or creating a free account.'
              : 'Descubre películas según tus gustos, explora géneros únicos y conéctate con otros amantes del cine iniciando sesión o creando una cuenta gratuita.'}
          </p>
        </div>

        <div className="card home-actions">
          <p>
            {language === 'en'
              ? 'Join us now and start your cinematic journey!'
              : '¡Únete ahora y comienza tu viaje cinematográfico!'}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/CreateAccount')}
          >
            {language === 'en' ? 'Get Started' : 'Comenzar'}
          </button>
          <p>
            {language === 'en'
              ? 'Already have an account?'
              : '¿Ya tienes una cuenta?'}
          </p>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/Login')}
          >
            {language === 'en' ? 'Login' : 'Iniciar sesión'}
          </button>
        </div>
      </div>

      <div className="home-right">
        <h2 className="text-center home-image-title">
          {language === 'en' ? 'Top Trending Movies' : 'Películas Populares'}
        </h2>
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
