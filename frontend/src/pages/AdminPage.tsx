import React, { useEffect, useState } from 'react';
import AddMovieForm from '../components/AddMovieForm';
import EditMovie from '../components/EditMovie';
import DeleteMovie from '../components/DeleteMovie';
import Pagination from '../components/pagination';
import PageWrapper from '../components/PageWrapper';

import {
  fetchMovies,
  addMovie,
  updateMovie,
  deleteMovie,
} from '../api/movieAPI';
import { Movie } from '../types/Movie';
import './AdminPage.css';

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

const AdminPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [formData, setFormData] =
    useState<Omit<Movie, 'show_id'>>(getDefaultFormData());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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

  const resetForm = () => {
    setFormData(getDefaultFormData());
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateMovie(editingId, { ...formData, show_id: editingId });
        setMessage('Movie updated successfully.');
      } else {
        await addMovie({ ...formData, show_id: Date.now().toString() });
        setMessage('Movie added successfully.');
      }

      // ✅ Move resetForm() inside a finally block to guarantee it always runs
      resetForm();
      await fetchMovieData();
    } catch (error) {
      console.error('❌ Error submitting movie:', error);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleEdit = (movie: Movie) => {
    const { show_id, ...rest } = movie;
    setFormData(rest);
    setEditingId(show_id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this movie?',
    );
    if (!confirmed) return;

    try {
      await deleteMovie(id);
      fetchMovieData();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <PageWrapper>
      <div className="admin-layout">
        {/* <aside className="admin-sidebar">
        <h3>Filter by Genre</h3>
        {Object.entries(formData)
          .filter(([_, value]) => typeof value === 'boolean')
          .map(([key, value]) => (
            <label key={key} className="filter-checkbox">
              <input
                type="checkbox"
                name={key}
                checked={value as boolean}
                onChange={handleChange}
              />
              {key.replace(/_/g, ' ')}
            </label>
          ))}
      </aside> */}

        <main className="admin-content">
          <button
            onClick={() => {
              if (showForm) {
                resetForm(); // 🧼 handles full cleanup for cancel
              } else {
                setShowForm(true); // 👈 just show the form when it's closed
              }
            }}
          >
            {showForm ? 'Cancel' : 'Add Movie'}
          </button>

          {message && <p className="form-message">{message}</p>}
          {showForm && (
            <AddMovieForm
              formData={formData}
              editingId={editingId}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData(getDefaultFormData());
              }}
              setFormData={setFormData}
            />
          )}

          <h2 className="text-center">Movie List</h2>
          <Pagination data={movies}>
            {(paginatedMovies) => (
              <table className="admin-movie-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Year</th>
                    <th>Type</th>
                    <th>Rating</th>
                    <th>Duration</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedMovies.map((movie) => (
                    <tr key={movie.show_id}>
                      <td>{movie.title}</td>
                      <td>{movie.release_year}</td>
                      <td>{movie.type}</td>
                      <td>{movie.rating}</td>
                      <td>{movie.duration}</td>
                      <td className="action-buttons">
                        <EditMovie onClick={() => handleEdit(movie)} />
                        <DeleteMovie
                          onClick={() => handleDelete(movie.show_id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Pagination>
        </main>
      </div>
    </PageWrapper>
  );
};

export default AdminPage;
