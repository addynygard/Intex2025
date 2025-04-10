import React from 'react';
import Select from 'react-select';
import { Movie } from '../types/Movie';
import './GenreTypes.css';

const GENRES = [
  { value: 'action', label: 'Action' },
  { value: 'adventure', label: 'Adventure' },
  {
    value: 'anime_Series_International_TV_Shows',
    label: 'Anime Series / International TV Shows',
  },
  {
    value: 'british_TV_Shows_Docuseries_International_TV_Shows',
    label: 'British / Docuseries / International TV',
  },
  { value: 'children', label: 'Children' },
  { value: 'comedies', label: 'Comedies' },
  {
    value: 'comedies_Dramas_International_Movies',
    label: 'Comedies / Dramas / Int. Movies',
  },
  { value: 'comedies_International_Movies', label: 'Comedies / Int. Movies' },
  { value: 'comedies_Romantic_Movies', label: 'Comedies / Romantic Movies' },
  { value: 'crime_TV_Shows_Docuseries', label: 'Crime / Docuseries' },
  { value: 'documentaries', label: 'Documentaries' },
  {
    value: 'documentaries_International_Movies',
    label: 'Documentaries / Int. Movies',
  },
  { value: 'docuseries', label: 'Docuseries' },
  { value: 'dramas', label: 'Dramas' },
  { value: 'dramas_International_Movies', label: 'Dramas / Int. Movies' },
  { value: 'dramas_Romantic_Movies', label: 'Dramas / Romantic Movies' },
  { value: 'family_Movies', label: 'Family Movies' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'horror_Movies', label: 'Horror' },
  { value: 'international_Movies_Thrillers', label: 'Int. Movies / Thrillers' },
  {
    value: 'international_TV_Shows_Romantic_TV_Shows_TV_Dramas',
    label: 'Int. TV / Romantic / Dramas',
  },
  { value: 'kids_TV', label: 'Kids TV' },
  { value: 'language_TV_Shows', label: 'Language TV Shows' },
  { value: 'musicals', label: 'Musicals' },
  { value: 'nature_TV', label: 'Nature TV' },
  { value: 'reality_TV', label: 'Reality TV' },
  { value: 'spirituality', label: 'Spirituality' },
  { value: 'tV_Action', label: 'TV Action' },
  { value: 'tV_Comedies', label: 'TV Comedies' },
  { value: 'tV_Dramas', label: 'TV Dramas' },
  { value: 'talk_Shows_TV_Comedies', label: 'Talk Shows / TV Comedies' },
  { value: 'thrillers', label: 'Thrillers' },
] as const;

// type GenreOption = (typeof GENRES)[number];

type GenreTypesProps = {
  formData: Omit<Movie, 'show_id'>;
  setFormData: React.Dispatch<React.SetStateAction<Omit<Movie, 'show_id'>>>;
};

const GenreTypes: React.FC<GenreTypesProps> = ({ formData, setFormData }) => {
  const selected = GENRES.filter(({ value }) => formData[value] === true);

  const handleChange = (
    selectedOptions: readonly { value: string; label: string }[] | null,
  ) => {
    setFormData((prev) => {
      const updated = { ...prev };

      // Set all genre fields to false first
      GENRES.forEach(({ value }) => {
        if (value in updated) {
          (updated as any)[value] = false;
        }
      });

      // Set selected genres to true
      selectedOptions?.forEach(({ value }) => {
        if (value in updated) {
          (updated as any)[value] = true;
        }
      });

      return updated;
    });
  };

  return (
    <div className="form-row genre-form-row">
      <label htmlFor="genres">Genres:</label>
      <div className="genre-select__container">
        <Select
          inputId="genres"
          options={GENRES}
          isMulti
          value={selected}
          onChange={handleChange}
          placeholder="Select genres..."
          classNamePrefix="genre-select"
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          isClearable={false}
        />
      </div>
    </div>
  );
};

export default GenreTypes;
