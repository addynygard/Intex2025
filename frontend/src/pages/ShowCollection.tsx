// src/pages/ShowCollection.tsx
import React from 'react';
import './MovieCollectionPage.css'; // Optional: create a new CSS file like ShowCollectionPage.css

const tvGenres = [
  "British TV Shows",
  "Crime TV Shows",
  "International TV Shows",
  "Romantic TV Shows",
  "TV Dramas",
  "Kids' TV",
  "Language TV Shows",
  "Nature TV",
  "Reality TV",
  "TV Action",
  "TV Comedies",
  "Talk Shows TV Comedies"
];

const tvShows = [
  { title: "Stranger Things", image: "/assets/strangerthings.jpg" },
  { title: "Bluey", image: "/assets/bluey.jpg" },
  { title: "Planet Earth", image: "/assets/planetearth.jpg" },
  { title: "The Office", image: "/assets/theoffice.jpg" },
  { title: "Brooklyn Nine-Nine", image: "/assets/brooklyn99.jpg" },
  // Add more TV show objects...
];

const ShowCollection = () => {
  return (
    <div className="movie-collection-container">
      <h1 className="page-title">TV Shows</h1>

      <div className="category-bar">
        {tvGenres.map((genre, index) => (
          <button key={index} className={`category-btn ${index === 0 ? 'active' : ''}`}>
            {genre}
          </button>
        ))}
      </div>

      <div className="movie-grid">
        {tvShows.map((show, index) => (
          <div key={index} className="movie-card">
            <img src={show.image} alt={show.title} className="movie-image" />
            <div className="movie-title">{show.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowCollection;
