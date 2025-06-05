import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPath';

export const UserContext = createContext();

const UserProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    setLoading(false);
    return;
  }

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
      setUser(response.data.user || response.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      setUser(null); // Optional fallback
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, []);  


  const updateUser = async (userData) => {
    try {
      setUser(userData);
      localStorage.setItem('token', userData.token);
      setLoading(false);
    } catch (error) {
      console.error('Failed to update user:', error);
      setError('Failed to update user');
    }
  }

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem('token');
    setLoading(false);
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;