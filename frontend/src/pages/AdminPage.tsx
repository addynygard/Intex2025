import React, { useEffect, useState } from 'react';
import Pagination from '../components/pagination';
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
      const result = await fetchMovies();
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
      {movies.length > 0 ? (
        <Pagination data={movies}>
          {(paginatedMovies) => (
            <div className="overflow-x-auto border border-gray-700 rounded-lg max-h-[600px] overflow-y-scroll mt-4">
              <table className="min-w-[1000px] table-auto text-sm w-full text-white">
                <thead className="bg-gray-900 sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-2 text-left">Title</th>
                    <th className="px-3 py-2 text-left">Type</th>
                    <th className="px-3 py-2 text-left">Year</th>
                    <th className="px-3 py-2 text-left">Director</th>
                    <th className="px-3 py-2 text-left">Cast</th>
                    <th className="px-3 py-2 text-left">Country</th>
                    <th className="px-3 py-2 text-left">Rating</th>
                    <th className="px-3 py-2 text-left">Duration</th>
                    <th className="px-3 py-2 text-left">Description</th>
                    <th className="px-3 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-black">
                  {paginatedMovies.map((movie) => (
                    <tr key={movie.show_id} className="border-b border-gray-700 hover:bg-gray-800">
                      <td className="px-3 py-2">{movie.title}</td>
                      <td className="px-3 py-2">{movie.type}</td>
                      <td className="px-3 py-2">{movie.release_year}</td>
                      <td className="px-3 py-2">{movie.director}</td>
                      <td className="px-3 py-2">{movie.cast}</td>
                      <td className="px-3 py-2">{movie.country}</td>
                      <td className="px-3 py-2">{movie.rating}</td>
                      <td className="px-3 py-2">{movie.duration}</td>
                      <td className="px-3 py-2">{movie.description}</td>
                      <td className="px-3 py-2 space-x-2">
                        <button
                          onClick={() => handleEdit(movie)}
                          className="px-2 py-1 text-xs bg-yellow-500 text-black rounded hover:bg-yellow-400"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(movie.show_id)}
                          className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-500"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Pagination>
      ) : (
        <p>No movies found.</p>
      )}

      <ConfirmationDialog />
    </div>
  );
};

export default AdminPage;
