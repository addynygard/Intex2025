import React from 'react';
import { Movie } from '../types/Movie';

type Props = {
  movie: Movie;
  onEdit: (movie: Movie) => void;
  onDelete: (id: string) => void;
};

const MovieListItem: React.FC<Props> = ({ movie, onEdit, onDelete }) => {
  return (
    <li className="movie-item">
      <strong>{movie.title}</strong> ({movie.release_year}) -{' '}
      {movie.description}
      <br />
      <button onClick={() => onEdit(movie)}>Edit</button>
      <button onClick={() => onDelete(movie.show_id)}>Delete</button>
    </li>
  );
};

export default MovieListItem;
