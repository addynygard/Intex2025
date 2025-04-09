import { Movie } from '../types/Movie';

const convertBooleansToInts = (movie: Movie) => {
  const converted: any = {};

  for (const [key, value] of Object.entries(movie)) {
    if (typeof value === 'boolean') {
      converted[key] = value ? 1 : 0;
    } else {
      converted[key] = value;
    }
  }

  return converted;
};


const API_URL = 'https://localhost:5000/api/Movie';

export const fetchMovies = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

export const addMovie = async (newMovie: Movie): Promise<Movie> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(convertBooleansToInts(newMovie)),
    });

    if (!response.ok) {
      throw new Error('Failed to add movie');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding movie:', error);
    throw error;
  }
};

export const updateMovie = async (
  movieID: string,
  updatedMovie: Movie
): Promise<Movie> => {
  try {
    const response = await fetch(`${API_URL}/${movieID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(convertBooleansToInts(updatedMovie)),
    });

    if (!response.ok) {
      throw new Error('Failed to update movie');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating movie:', error);
    throw error;
  }
};

export const deleteMovie = async (movieID: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/${movieID}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete movie');
    }
  } catch (error) {
    console.error('Error deleting movie:', error);
    throw error;
  }
};
