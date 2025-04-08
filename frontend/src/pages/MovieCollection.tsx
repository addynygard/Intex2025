// src/pages/MovieCollection.tsx
import React from 'react';
import './MovieCollectionPage.css';

const categories = [
    "Featured", // Optional: manually keep this first
    "Action", "Adventure", "Anime Series", "Docuseries", "Children", "Comedies",
    "Comedies Dramas", "Comedies International Movies", "Comedies Romantic Movies",
    "Documentaries", "Documentaries International Movies", "Dramas",
    "Dramas International Movies", "Dramas Romantic Movies", "Family Movies",
    "Fantasy", "Horror Movies", "International Movies Thrillers", "Musicals",
    "Spirituality", "Thrillers"
  ];
  

const movies = [
  { title: "Moana 2", image: "/assets/moana2.jpg" },
  { title: "Jumanji", image: "/assets/jumanji.jpg" },
  { title: "The Space Race", image: "/assets/space.jpg" },
  { title: "Dr. Pol", image: "/assets/drpol.jpg" },
  { title: "Jurassic Park", image: "/assets/jurassic.jpg" },
  // Add more movie objects...
];

const MovieCollection = () => {
  return (
    <div className="movie-collection-container">
      <h1 className="page-title">Movies</h1>

      <div className="category-bar">
        {categories.map((cat, index) => (
          <button key={index} className={`category-btn ${index === 0 ? 'active' : ''}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="movie-grid">
        {movies.map((movie, index) => (
          <div key={index} className="movie-card">
            <img src={movie.image} alt={movie.title} className="movie-image" />
            <div className="movie-title">{movie.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieCollection;
