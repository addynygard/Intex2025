import React, { useEffect, useState } from 'react';
import './MoviePage.css';
import { Movie } from '../types/Movie';
import Carousel from '../components/Carousel';
import TopCarousel from '../components/TopCarousel';
import { useUser } from '../context/UserContext';
import { API_URL } from '../api/movieAPI';
import PageWrapper from '../components/PageWrapper'; // ✅ Import it

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
          `${API_URL}/api/recommendation/top-rated`,
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
          `${API_URL}/api/recommendation/user/${userId}`,
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
          `${API_URL}/api/recommendation/genre/${genre}`,
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
    <PageWrapper>
      {/* 🎯 Top 10 Movies – from top_rated_movies */}
      {topRated.length > 0 && <TopCarousel items={topRated} />}

      <div className="movie-page">
        {/* 🎯 Personalized Recommendations */}
        {userRecs.length > 0 && (
          <Carousel genre="Recommended For You" movies={userRecs} />
        )}

        {/* 🎬 Genre Sections from Recommender Models */}
        {actionTop.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <Carousel genre="Action Picks" movies={actionTop} />
          </div>
        )}

        {comedyTop.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <Carousel genre="Laugh Out Loud" movies={comedyTop} />
          </div>
        )}

        {thrillerTop.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <Carousel genre="Terrific Thrillers" movies={thrillerTop} />
          </div>
        )}
      </div>


    </PageWrapper>
  );
};

export default MoviePage;
