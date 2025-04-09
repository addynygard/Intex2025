import React from 'react';
import { Movie } from '../types/Movie';
import './AddMovieForm.css'; // create this if you haven’t yet
import GenreTypes from './GenreTypes';

type Props = {
  formData: Omit<Movie, 'show_id'>;
  editingId: string | null;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  setFormData: React.Dispatch<React.SetStateAction<Omit<Movie, 'show_id'>>>;
};

const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'India',
  'Japan',
  'South Korea',
  'Brazil',
  'Mexico',
  'China',
  'Russia',
  'Sweden',
  'Norway',
  'Denmark',
  'Finland',
  'Netherlands',
  'Belgium',
  'Switzerland',
  'New Zealand',
  'Ireland',
  'Argentina',
  'Colombia',
  'Chile',
  'Philippines',
  'Thailand',
  'Turkey',
  'Indonesia',
  'Nigeria',
  'South Africa',
  'Egypt',
  'Poland',
  'Portugal',
  'Vietnam',
  'Malaysia',
  'Greece',
  'Czech Republic',
  'Ukraine',
  'Romania',
  'Saudi Arabia',
  'Israel',
  'United Arab Emirates',
  'Singapore',
  'Hungary',
  'Austria',
  'Peru',
  'Venezuela',
  'Other',
];

const AddMovieForm: React.FC<Props> = ({
  formData,
  editingId,
  onChange,
  onSubmit,
  onCancel,
  setFormData,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={onSubmit} className="movie-form">
          <h2>{editingId ? 'Edit Movie' : 'Add New Movie'}</h2>

          <div className="form-row">
            <label htmlFor="title">Title:</label>
            <input
              id="title"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-row">
            <label htmlFor="type">Type:</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={onChange}
            >
              <option value="">Select Type</option>
              <option value="Movie">Movie</option>
              <option value="TV Show">TV Show</option>
            </select>
          </div>
          {/* <div className="form-row"> */}
            <GenreTypes formData={formData} setFormData={setFormData} />
          {/* </div> */}
          <div className="form-row">
            <label htmlFor="director">Director:</label>
            <input
              id="director"
              name="director"
              placeholder="Director"
              value={formData.director}
              onChange={onChange}
            />
          </div>
          <div className="form-row">
            <label htmlFor="cast">Cast:</label>
            <input
              id="cast"
              name="cast"
              placeholder="Cast"
              value={formData.cast}
              onChange={onChange}
            />
          </div>
          <div className="form-row">
            <label htmlFor="country">Country:</label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={onChange}
            >
              {!COUNTRIES.includes(formData.country) && formData.country && (
                <option value={formData.country}>{formData.country}</option>
              )}
              <option value="">Select Country</option>
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label htmlFor="release_year">Release Year:</label>
            <input
              id="release_year"
              name="release_year"
              type="number"
              placeholder="Release Year"
              value={formData.release_year}
              onChange={onChange}
            />
          </div>
          <div className="form-row">
            <label htmlFor="rating">Rating:</label>
            <select
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={onChange}
            >
              <option value="">Select Rating</option>
              <option value="G">G</option>
              <option value="PG">PG</option>
              <option value="PG-13">PG-13</option>
              <option value="R">R</option>
              <option value="TV-Y">TV-Y</option>
              <option value="TV-Y7">TV-Y7</option>
              <option value="TV-G">TV-G</option>
              <option value="TV-PG">TV-PG</option>
              <option value="TV-14">TV-14</option>
              <option value="TV-MA">TV-MA</option>
            </select>
          </div>
          <div className="form-row">
            <label htmlFor="duration">Duration:</label>
            <input
              id="duration"
              name="duration"
              placeholder="Duration"
              value={formData.duration}
              onChange={onChange}
            />
          </div>
          <div className="form-row">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={onChange}
            />
          </div>

          <div className="modal-buttons">
            <button type="submit">{editingId ? 'Update' : 'Add'} Movie</button>
            <button type="button" className="cancel-button" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMovieForm;
