import React from 'react';
import { Movie } from '../types/Movie';

type Props = {
  formData: Omit<Movie, 'show_id'>;
  editingId: string | null;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
};

const AddMovieForm: React.FC<Props> = ({
  formData,
  editingId,
  onChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="movie-form">
      <h2>{editingId ? 'Edit Movie' : 'Add New Movie'}</h2>

      <input
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={onChange}
        required
      />
      <input
        name="type"
        placeholder="Type"
        value={formData.type}
        onChange={onChange}
        required
      />
      <input
        name="director"
        placeholder="Director"
        value={formData.director}
        onChange={onChange}
      />
      <input
        name="cast"
        placeholder="Cast"
        value={formData.cast}
        onChange={onChange}
      />
      <input
        name="country"
        placeholder="Country"
        value={formData.country}
        onChange={onChange}
      />
      <input
        name="release_year"
        type="number"
        placeholder="Release Year"
        value={formData.release_year}
        onChange={onChange}
      />
      <input
        name="rating"
        placeholder="Rating"
        value={formData.rating}
        onChange={onChange}
      />
      <input
        name="duration"
        placeholder="Duration"
        value={formData.duration}
        onChange={onChange}
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={onChange}
      />

      <button type="submit">{editingId ? 'Update' : 'Add'} Movie</button>
    </form>
  );
};

export default AddMovieForm;
