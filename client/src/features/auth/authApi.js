import { setCredentials } from '@/features/auth/authSlice';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const signInUser = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    console.log('signInUser Response:', res);

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Sign in failed');
    }

    const dataJson = await res.json();
    console.log('signInUser JSON Data:', dataJson);

    dispatch(setCredentials(dataJson));
    return dataJson;
  } catch (error) {
    console.error('signInUser error:', error.message, error);
    throw error;
  }
};

export const signUpUser = (data) => async (dispatch) => {
  console.log('signUpUser called with data:', data);
  try {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    console.log('signUpUser Response:', res);

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Sign up failed');
    }

    const dataJson = await res.json();
    console.log('signUpUser JSON Data:', dataJson);

    dispatch(setCredentials(dataJson));
    return dataJson;
  } catch (error) {
    console.error('signUpUser error:', error.message, error);
    throw error;
  }
};