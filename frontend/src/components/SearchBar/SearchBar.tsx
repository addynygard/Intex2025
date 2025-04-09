import React, { useEffect, useRef, useState } from 'react';
import {
  SearchWrapper,
  SearchIcon,
  Input,
  ResultsWrapper,
  ResultItem,
} from './SearchBar.styles';
import { Movie } from '../../types/Movie';
import { useNavigate } from 'react-router-dom'; // Added useNavigate for navigation

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Movie[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate(); // Initialize navigation hook

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query) {
      setResults([]);
      setOpen(false);
      return;
    }

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      fetch(
        `http://localhost:8000/api/movie/search?title=${encodeURIComponent(query)}`,
      )
        .then((res) => res.json())
        .then((data: Movie[]) => {
          console.log('Search results:', data);
          setResults(data.slice(0, 5));
          setOpen(true);
        })
        .catch((err) => {
          console.error('Error fetching movies:', err);
          setResults([]);
          setOpen(false);
        });
    }, 300);
  }, [query]);

  const handleSelect = (movie: Movie) => {
    navigate(`/movie/${movie.show_id}`); // Navigate to the Movie Detail Page
    setOpen(false);
    console.log('Navigating to movie details:', movie);
  };

  return (
    <SearchWrapper ref={ref}>
      <SearchIcon onClick={() => setOpen(true)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          width="20"
          height="20"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="17" y1="17" x2="22" y2="22" />
        </svg>
      </SearchIcon>

      <Input
        type="text"
        value={query}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setQuery(e.target.value)
        }
        onFocus={() => {
          if (results.length > 0) setOpen(true);
        }}
        placeholder="Search titles..."
      />

      {/* 👉 Move this outside the fragment so it always renders inside SearchWrapper */}
      {open && query && (
        <ResultsWrapper>
          {results.length > 0 ? (
            results.map((movie) => (
              <ResultItem
                key={movie.show_id}
                onClick={() => handleSelect(movie)} // Updated to navigate on click
              >
                {movie.title}
              </ResultItem>
            ))
          ) : (
            <ResultItem>No matches found</ResultItem>
          )}
        </ResultsWrapper>
      )}
    </SearchWrapper>
  );
};

export default SearchBar;
