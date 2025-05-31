import axios from 'axios';

export const getCurrentUser = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/auth/me', {
      withCredentials: true
    });
    return response.data;
  } catch (err) {
    return null;
  }
};
