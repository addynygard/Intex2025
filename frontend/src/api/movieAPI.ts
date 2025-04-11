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

// export const API_URL =
//   'https://intex2025-group3-5-2nd-backend-ehfjgfbkgpddatfk.eastus-01.azurewebsites.net';
export const API_URL = 'https://localhost:5000';

export const fetchMovies = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(`${API_URL}/api/movie`);

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
    const response = await fetch(`${API_URL}/api/movie`, {
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
  updatedMovie: Movie,
): Promise<Movie | null> => {
  try {
    const response = await fetch(`${API_URL}/api/movie/${movieID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(convertBooleansToInts(updatedMovie)),
    });

    if (!response.ok) {
      throw new Error('Failed to update movie');
    }

    // 🔒 Handle cases where response body might be empty
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error('Error updating movie:', error);
    throw error;
  }
};

export const deleteMovie = async (movieID: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/api/movie/${movieID}`, {
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

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 🔒 important for auth cookies
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const getUserRoles = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_URL}/pingauth`, {
      credentials: 'include', // 🔒 ensures cookies are sent
    });

    if (!response.ok) {
      throw new Error('Not authorized');
    }

    const data = await response.json();
    console.log('🎭 User roles:', data.roles);
    return data.roles;
  } catch (error) {
    console.error('Failed to fetch user roles:', error);
    return []; // return empty array if it fails
  }
};

export const createAccount = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/createAccount`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 🔒 if you want to log them in right after
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error[0]?.description || 'Failed to create account');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
};
