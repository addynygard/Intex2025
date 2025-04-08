import React, { useEffect, useState } from "react";
import axios from "axios";

interface Movie {
  show_id: string;
  title: string;
  release_year: number;
  rating: string;
  duration: string;
  description: string;
  type: string;
   
  // Genre flags
  Comedies?: number;
  "TV Comedies"?: number;
  Dramas?: number;
  "TV Dramas"?: number;
  Action?: number;
  Fantasy?: number;
  "Horror Movies"?: number;
  [key: string]: any; // catches any other genres without redefining everything

}



const MovieDetailPage = () => {
  const id = "s2613";  
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    axios.get(`https://localhost:5000/api/movie/${id}`)
      .then((res) => {
        console.log("Movie received:", res.data);
        setMovie(res.data);
      });
  }, [id]);
  

  const extractGenres = (movie: Movie): string[] => {
    const genreMap: { [key: string]: string } = {
      action: "Action",
      adventure: "Adventure",
      anime_Series_International_TV_Shows: "Anime Series",
      british_TV_Shows_Docuseries_International_TV_Shows: "British TV/Docuseries",
      children: "Children",
      comedies: "Comedies",
      comedies_Dramas_International_Movies: "Comedies & Dramas",
      comedies_International_Movies: "International Comedies",
      comedies_Romantic_Movies: "Romantic Comedies",
      crime_TV_Shows_Docuseries: "Crime Docuseries",
      documentaries: "Documentaries",
      documentaries_International_Movies: "International Documentaries",
      docuseries: "Docuseries",
      dramas: "Dramas",
      dramas_International_Movies: "International Dramas",
      dramas_Romantic_Movies: "Romantic Dramas",
      family_Movies: "Family Movies",
      fantasy: "Fantasy",
      horror_Movies: "Horror Movies",
      international_Movies_Thrillers: "International Thrillers",
      international_TV_Shows_Romantic_TV_Shows_TV_Dramas: "International Romantic TV/Dramas",
      kids__TV: "Kids' TV",
      language_TV_Shows: "Language TV Shows",
      musicals: "Musicals",
      nature_TV: "Nature TV",
      reality_TV: "Reality TV",
      spirituality: "Spirituality",
      tv_Action: "TV Action",
      tv_Comedies: "TV Comedies",
      tv_Dramas: "TV Dramas",
      talk_Shows_TV_Comedies: "Talk Shows & TV Comedies",
      thrillers: "Thrillers",
    };
  
    return Object.entries(genreMap)
      .filter(([key]) => movie[key] === 1)
      .map(([, label]) => label);
  };
  
  

  if (!movie) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black text-white px-10 py-10 flex flex-col md:flex-row gap-10 items-start">
      {/* Movie Poster */}
      <div className="w-full md:w-1/3 flex justify-center">
        <img
          src="/Beynelmilel.jpg"
          alt={`${movie.title} Poster`}
          className="rounded-2xl shadow-lg max-w-xs w-full object-cover"
        />
      </div>
  
      {/* Movie Info */}
      <div className="md:w-2/3 space-y-4">
        <h1 className="text-5xl font-extrabold">{movie.title}</h1>
        <p className="text-sm text-gray-300">
          {movie.release_year} • {movie.rating || "NR"} • {movie.duration || "??"} min •{" "}
          {extractGenres(movie).join(", ") || "Uncategorized"}
        </p>
        <p className="italic text-purple-400">{movie.type}</p>
        <p className="text-lg max-w-2xl">{movie.description}</p>
  
        <div className="mt-6 flex gap-4">
          <button className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-300 transition">
            ▶ Play
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-full font-semibold transition">
            Trailer
          </button>
        </div>
      </div>
    </div>
  );
  
};

export default MovieDetailPage;
