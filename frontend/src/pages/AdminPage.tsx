import React, { useEffect, useState } from 'react';
import {
  fetchMovies,
  addMovie,
  updateMovie,
  deleteMovie,
} from '../api/movieAPI';
import { Movie } from '../types/Movie';

const getDefaultFormData = (): Omit<Movie, 'show_id'> => ({
  type: '',
  title: '',
  director: '',
  cast: '',
  country: '',
  release_year: new Date().getFullYear(),
  rating: '',
  duration: '',
  description: '',
  action: false,
  adventure: false,
  anime_Series_International_TV_Shows: false,
  british_TV_Shows_Docuseries_International_TV_Shows: false,
  children: false,
  comedies: false,
  comedies_Dramas_International_Movies: false,
  comedies_International_Movies: false,
  comedies_Romantic_Movies: false,
  crime_TV_Shows_Docuseries: false,
  documentaries: false,
  documentaries_International_Movies: false,
  docuseries: false,
  dramas: false,
  dramas_International_Movies: false,
  dramas_Romantic_Movies: false,
  family_Movies: false,
  fantasy: false,
  horror_Movies: false,
  international_Movies_Thrillers: false,
  international_TV_Shows_Romantic_TV_Shows_TV_Dramas: false,
  kids_TV: false,
  language_TV_Shows: false,
  musicals: false,
  nature_TV: false,
  reality_TV: false,
  spirituality: false,
  tV_Action: false,
  tV_Comedies: false,
  tV_Dramas: false,
  talk_Shows_TV_Comedies: false,
  thrillers: false,
});

// Confirmation Dialog Hook
const useConfirmation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [onConfirm, setOnConfirm] = useState<(() => void) | null>(null);

  const requestConfirmation = (msg: string, onConfirmCallback: () => void) => {
    setMessage(msg);
    setOnConfirm(() => onConfirmCallback);
    setIsVisible(true);
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    setIsVisible(false);
  };

  const handleCancel = () => {
    setIsVisible(false);
  };

  const ConfirmationDialog = () =>
    isVisible ? (
      <div className="confirmation-dialog" style={{ background: '#eee', padding: '1rem', margin: '1rem 0' }}>
        <p>{message}</p>
        <button onClick={handleConfirm}>Yes</button>
        <button onClick={handleCancel}>No</button>
      </div>
    ) : null;

  return { requestConfirmation, ConfirmationDialog };
};

const AdminPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [formData, setFormData] = useState<Omit<Movie, 'show_id'>>(getDefaultFormData());
  const [editingId, setEditingId] = useState<string | null>(null);

  const { requestConfirmation, ConfirmationDialog } = useConfirmation();

  const fetchMovieData = async () => {
    try {
      const result = await fetchMovies(); // Now returns just Movie[]
      setMovies(result);
    } catch (err) {
      console.error('Failed to fetch movies:', err);
    }
  };

  useEffect(() => {
    fetchMovieData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: checkbox.checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        requestConfirmation('Are you sure you want to update this movie?', async () => {
          await updateMovie(editingId, { ...formData, show_id: editingId });
          setFormData(getDefaultFormData());
          setEditingId(null);
          fetchMovieData();
        });
      } else {
        await addMovie({ ...formData, show_id: Date.now().toString() });
        setFormData(getDefaultFormData());
        fetchMovieData();
      }
    } catch (error) {
      console.error('Error submitting movie:', error);
    }
  };

  const handleEdit = (movie: Movie) => {
    requestConfirmation('Are you sure you want to edit this movie?', () => {
      const { show_id, ...rest } = movie;
      setFormData(rest);
      setEditingId(show_id);
    });
  };

  const handleDelete = (id: string) => {
    requestConfirmation('Are you sure you want to delete this movie?', async () => {
      try {
        await deleteMovie(id);
        fetchMovieData();
      } catch (err) {
        console.error('Delete failed:', err);
      }
    });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{editingId ? 'Edit Movie' : 'Add New Movie'}</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
        <input name="type" placeholder="Type" value={formData.type} onChange={handleChange} required />
        <input name="director" placeholder="Director" value={formData.director} onChange={handleChange} />
        <input name="cast" placeholder="Cast" value={formData.cast} onChange={handleChange} />
        <input name="country" placeholder="Country" value={formData.country} onChange={handleChange} />
        <input name="release_year" type="number" placeholder="Release Year" value={formData.release_year} onChange={handleChange} />
        <input name="rating" placeholder="Rating" value={formData.rating} onChange={handleChange} />
        <input name="duration" placeholder="Duration" value={formData.duration} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />

        <fieldset>
          <legend>Genres</legend>
          {Object.entries(formData)
            .filter(([_, value]) => typeof value === 'boolean')
            .map(([key, value]) => (
              <label key={key} style={{ marginRight: '1rem' }}>
                <input
                  type="checkbox"
                  name={key}
                  checked={value as boolean}
                  onChange={handleChange}
                />
                {key}
              </label>
            ))}
        </fieldset>

        <button type="submit">{editingId ? 'Update' : 'Add'} Movie</button>
      </form>

      <h3>Movie List</h3>
      <ul>
        {Array.isArray(movies) && movies.length > 0 ? (
          movies.map((movie) => (
            <li key={movie.show_id}>
              <strong>{movie.title}</strong> ({movie.release_year}) - {movie.description}
              <br />
              <button onClick={() => handleEdit(movie)}>Edit</button>
              <button onClick={() => handleDelete(movie.show_id)}>Delete</button>
            </li>
          ))
        ) : (
          <li>No movies found.</li>
        )}
      </ul>

      <ConfirmationDialog />
    </div>
  );
};

export default AdminPage;
