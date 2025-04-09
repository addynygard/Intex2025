import React, { useEffect, useState } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import './MovieCollectionPage.css';
import ImageLink from '../components/ImageLink';
import { Movie } from '../types/Movie';

const categories = [
    "Featured",
    "All Movies ",
    "Action/Adventure",
    "Anime",
    "Docuseries",
    "Children",
    "Comedies",         // includes Comedy Dramas, Romantic Comedies, Intl Comedies
    "Documentaries",    // includes Intl Documentaries
    "Dramas",           // includes Romantic Dramas, Intl Dramas
    "Family",
    "Fantasy",
    "Horror",
    "International", // includes Intl Thrillers, Intl Dramas
    "Musicals",
    "Spirituality",
    "Thrillers",
    "Reality TV",       // optional extra if included in your UI
    "No Genre"
  ];
  
  const genreFilterMap: { [key: string]: string[] } = {
    "Action/Adventure": ["Action", "Adventure", "TV Action"],
    "Anime": ["Anime Series International TV Shows"],
    "Docuseries": ["Docuseries", "British TV Shows Docuseries International TV Shows", "Crime TV Shows Docuseries"],
    "Children": ["Children", "Kids' TV"],
    "Comedies": [
      "Comedies",
      "Comedies Dramas International Movies",
      "Comedies International Movies",
      "Comedies Romantic Movies",
      "Talk Shows TV Comedies",
      "TV Comedies"
    ],
    "Documentaries": ["Documentaries", "Documentaries International Movies", "Nature TV"],
    "Dramas": ["Dramas", "Dramas International Movies", "TV Dramas", "Dramas Romantic Movies"],
    "Family": ["Family Movies"],
    "Fantasy": ["Fantasy"],
    "Horror": ["Horror Movies"],
    "International": [
      "International Movies Thrillers",
      "International TV Shows Romantic TV Shows TV Dramas",
      "Language TV Shows"
    ],
    "Musicals": ["Musicals"],
    "Spirituality": ["Spirituality"],
    "Thrillers": ["Thrillers"],
    "Reality TV": ["Reality TV"]
  };
  
  

const CARD_WIDTH = 200;
const CARD_HEIGHT = 320;

const getPrimaryGenre = (movie: any): string => {
    const genreMap: { [key: string]: string } = {
      // Action/Adventure
      action: "Action/Adventure",
      adventure: "Action/Adventure",
      tv_Action: "Action/Adventure",
  
      // Anime
      anime_Series_International_TV_Shows: "Anime",
  
      // Docuseries
      docuseries: "Docuseries",
      british_TV_Shows_Docuseries_International_TV_Shows: "Docuseries",
      crime_TV_Shows_Docuseries: "Docuseries",
  
      // Children
      children: "Children",
      kids_TV: "Children",
  
      // Comedies
      comedies: "Comedies",
      comedies_Dramas_International_Movies: "Comedies",
      comedies_International_Movies: "Comedies",
      comedies_Romantic_Movies: "Comedies",
      talk_Shows_TV_Comedies: "Comedies",
      tv_Comedies: "Comedies",
  
      // Documentaries
      documentaries: "Documentaries",
      documentaries_International_Movies: "Documentaries",
      nature_TV: "Documentaries",
  
      // Dramas
      dramas: "Dramas",
      dramas_International_Movies: "Dramas",
      dramas_Romantic_Movies: "Dramas",
      tv_Dramas: "Dramas",
  
      // Family
      family_Movies: "Family Movies",
  
      // Fantasy
      fantasy: "Fantasy",
  
      // Horror
      horror_Movies: "Horror Movies",
  
      // International
      international_Movies_Thrillers: "International Movies",
      international_TV_Shows_Romantic_TV_Shows_TV_Dramas: "International Movies",
      language_TV_Shows: "International Movies",
  
      // Musicals
      musicals: "Musicals",
  
      // Spirituality
      spirituality: "Spirituality",
  
      // Thrillers
      thrillers: "Thrillers",
  
      // Reality
      reality_TV: "Reality TV",
    };
  
    for (const key in genreMap) {
      const value = movie[key];
      if (
        value === 1 ||
        value === true ||
        value === "1" ||
        (typeof value === "string" && value.toLowerCase() === "true")
      ) {
        return genreMap[key];
      }
    }
  
    return "Unknown";
  };
  
  
  
  
  

  'Featured', // Optional: manually keep this first
  'Action',
  'Adventure',
  'Anime Series',
  'Docuseries',
  'Children',
  'Comedies',
  'Comedies Dramas',
  'Comedies International Movies',
  'Comedies Romantic Movies',
  'Documentaries',
  'Documentaries International Movies',
  'Dramas',
  'Dramas International Movies',
  'Dramas Romantic Movies',
  'Family Movies',
  'Fantasy',
  'Horror Movies',
  'International Movies Thrillers',
  'Musicals',
  'Spirituality',
  'Thrillers',
];

const movies = [
  { title: 'Moana 2', image: '/assets/moana2.jpg' },
  { title: 'Jumanji', image: '/assets/jumanji.jpg' },
  { title: 'The Space Race', image: '/assets/space.jpg' },
  { title: 'Dr. Pol', image: '/assets/drpol.jpg' },
  { title: 'Jurassic Park', image: '/assets/jurassic.jpg' },
  // Add more movie objects...
];


const MovieCollection = () => {
  const [selectedGenre, setSelectedGenre] = useState('Featured');
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMoviesByGenre = async () => {
        try {
          let url = "https://localhost:5000/api/Movie";
      
          if (selectedGenre === "Featured" || selectedGenre === "All Movies") {
            url += "/filter?genre=Featured"; // ✅ Triggers "return all movies"
          } else if (selectedGenre === "No Genre") {
            url += "/filter?genre=Unknown";
          } else {
            const filters = genreFilterMap[selectedGenre] || [];
            const backendGenre = filters[0] || selectedGenre;
            url += `/filter?genre=${encodeURIComponent(backendGenre)}`;
          }
      
          console.log("Fetching from:", url);
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error("Failed to fetch movies");
          }
      
          const data = await response.json();
          setMovies(data);
        } catch (error) {
          console.error("Error fetching movies:", error);
        }
      };
      
  
    fetchMoviesByGenre();
  }, [selectedGenre]);
  

  const Cell = ({ columnIndex, rowIndex, style }: any) => {
    const columnCount = Math.floor(window.innerWidth / CARD_WIDTH);
    const index = rowIndex * columnCount + columnIndex;
    if (index >= movies.length) return null;
  
    const movie = movies[index];
  
    // ✅ ADD THIS LINE HERE
    console.log("Movie keys:", Object.keys(movie));
    console.log("Movie object:", movie); // (Optional: to inspect values too)
  
    return (
      <div style={{ ...style, padding: '8px' }}>
        <div className="movie-card">
          <ImageLink movieTitle={movie.title} size="small" />
          <div className="movie-title">{movie.title}</div>
          <div className="movie-info">
            <span className="movie-rating">{movie.rating || 'N/A'}</span>
            <span className="movie-year">• {movie.release_year || '—'}</span>
            <span className="movie-genre">• {getPrimaryGenre(movie)}</span>
          </div>
        </div>
      </div>
    );
  };
  

  return (
    <div className="movie-collection-container">
      <h1 className="page-title">Movies</h1>


      <div className="category-bar-wrapper">
        <div className="category-bar">
            {categories.map((cat, index) => (
            <button
                key={index}
                className={`category-btn ${selectedGenre === cat ? 'active' : ''}`}
                onClick={() => setSelectedGenre(cat)}
            >
                {cat}
            </button>
            ))}
        </div>
        <div className="category-fade" />
        </div>

      <div style={{ width: '100%' }}>
        <AutoSizer disableHeight>
          {({ width }) => {
            const columnCount = Math.floor(width / CARD_WIDTH);
            const rowCount = Math.ceil(movies.length / columnCount);
            const totalHeight = rowCount * CARD_HEIGHT;

            return (
              <div className="movie-grid-wrapper" style={{ height: `${totalHeight}px` }}>
                <Grid
                  columnCount={columnCount}
                  columnWidth={CARD_WIDTH}
                  height={totalHeight}
                  rowCount={rowCount}
                  rowHeight={CARD_HEIGHT}
                  width={width}
                >
                  {Cell}
                </Grid>
              </div>
            );
          }}
        </AutoSizer>
      </div>
    </div>
  );
};

export default MovieCollection;
