import React, { useEffect, useState } from 'react';
import './MoviePage.css';
import { Movie } from '../types/Movie';
import Carousel from '../components/Carousel';
import TopCarousel from '../components/TopCarousel';
import { useUser } from '../context/UserContext';

const MoviePage = () => {
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [userRecs, setUserRecs] = useState<Movie[]>([]);
  const [actionTop, setActionTop] = useState<Movie[]>([]);
  const [comedyTop, setComedyTop] = useState<Movie[]>([]);
  const [thrillerTop, setThrillerTop] = useState<Movie[]>([]);

  const { userId } = useUser();

  // ✅ Fetch Top 10 from top_rated_movies
  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        const res = await fetch(
          'https://localhost:5000/api/recommendation/top-rated',
        );
        const data = await res.json();
        setTopRated(data);
      } catch (err) {
        console.error('Failed to fetch top rated movies:', err);
      }
    };

    fetchTopRated();
  }, []);

  // ✅ Fetch User-Based Recs
  useEffect(() => {
    const fetchUserRecs = async () => {
      try {
        const res = await fetch(
          `https://localhost:5000/api/recommendation/user/${userId}`,
        );
        const data = await res.json();
        setUserRecs(data);
      } catch (err) {
        console.error('Failed to fetch user recs:', err);
      }
    };

    if (userId) {
      fetchUserRecs();
    }
  }, [userId]);

  // ✅ Fetch Top by Genre from FastAPI
  useEffect(() => {
    const fetchGenre = async (
      genre: string,
      setter: React.Dispatch<React.SetStateAction<Movie[]>>,
    ) => {
      try {
        const res = await fetch(
          `https://localhost:5000/api/recommendation/genre/${genre}`,
        );
        const data = await res.json();
        setter(data);
      } catch (err) {
        console.error(`Failed to fetch top ${genre} movies:`, err);
      }
    };

    fetchGenre('action', setActionTop);
    fetchGenre('comedies', setComedyTop);
    fetchGenre('thrillers', setThrillerTop);
  }, []);

  return (
    <>
      {/* 🎯 Top 10 Movies – from top_rated_movies */}
      {topRated.length > 0 && <TopCarousel items={topRated} />}

      <div className="movie-page">
        <h1>Welcome to Your Movie Library</h1>

        {/* 🎯 Personalized Recommendations */}
        {userRecs.length > 0 && (
          <Carousel genre="Recommended For You" movies={userRecs} />
        )}

        {/* 🎬 Genre Sections from Recommender Models */}
        {actionTop.length > 0 && (
          <Carousel genre="Action Picks" movies={actionTop} />
        )}
        {comedyTop.length > 0 && (
          <Carousel genre="Laugh Out Loud" movies={comedyTop} />
        )}
        {thrillerTop.length > 0 && (
          <Carousel genre="Terrific Thrillers" movies={thrillerTop} />
        )}
      </div>
    </>
  );
};

export default MoviePage;
