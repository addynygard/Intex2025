import React, { useEffect, useRef, useState } from 'react';
import {
  SearchWrapper,
  SearchIcon,
  Input,
  ResultsWrapper,
  ResultItem
} from './SearchBar.styles';
import { Movie } from '../../types/Movie';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Movie[]>([]);
  const [open, setOpen] = useState<boolean>(false); // toggle state
  const ref = useRef<HTMLDivElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Close when clicking outside
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
      return;
    }

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      fetch(`/api/movie/search?title=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data: Movie[]) => {
          setResults(data.slice(0, 5));
        })
        .catch((err) => console.error('Error fetching movies:', err));
    }, 300);
  }, [query]);

  return (
    <SearchWrapper ref={ref} open={open}>
      <SearchIcon onClick={() => setOpen((prev) => !prev)}>
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

      {open && (
        <>
          <Input
            type="text"
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            autoFocus
            placeholder="Search titles..."
          />
          {results.length > 0 && (
            <ResultsWrapper>
              {results.map((movie) => (
                <ResultItem key={movie.show_id}>{movie.title}</ResultItem>
              ))}
            </ResultsWrapper>
          )}
        </>
      )}
    </SearchWrapper>
  );
};

export default SearchBar;
