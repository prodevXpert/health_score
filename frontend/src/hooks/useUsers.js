import { useState, useEffect } from 'react';
import defaultUsers from 'data/users.json';

const STORAGE_KEY = 'healthscore_users';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize users from localStorage or use default mock data
  useEffect(() => {
    const storedUsers = localStorage.getItem(STORAGE_KEY);
    if (storedUsers) {
      try {
        setUsers(JSON.parse(storedUsers));
      } catch (error) {
        console.error('Error parsing stored users:', error);
        setUsers(defaultUsers);
      }
    } else {
      setUsers(defaultUsers);
    }
    setLoading(false);
  }, []);

  // Save users to localStorage
  const saveUsers = (updatedUsers) => {
    setUsers(updatedUsers);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
  };

  // Add a single user
  const addUser = (userData) => {
    const newUser = {
      id: `USR-${Date.now()}`,
      ...userData,
      last_updated: new Date().toISOString().split('T')[0]
    };
    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    return newUser;
  };

  // Add multiple users (from CSV/JSON)
  const addUsers = (newUsers) => {
    const usersWithIds = newUsers.map((user, index) => ({
      id: user.id || `USR-${Date.now()}-${index}`,
      ...user,
      last_updated: user.last_updated || new Date().toISOString().split('T')[0]
    }));
    const updatedUsers = [...users, ...usersWithIds];
    saveUsers(updatedUsers);
    return usersWithIds;
  };

  // Update a user
  const updateUser = (userId, userData) => {
    const updatedUsers = users.map((user) =>
      user.id === userId
        ? { ...user, ...userData, last_updated: new Date().toISOString().split('T')[0] }
        : user
    );
    saveUsers(updatedUsers);
  };

  // Delete a user
  const deleteUser = (userId) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    saveUsers(updatedUsers);
  };

  // Reset to default users
  const resetToDefault = () => {
    saveUsers(defaultUsers);
  };

  return {
    users,
    loading,
    addUser,
    addUsers,
    updateUser,
    deleteUser,
    resetToDefault
  };
}

