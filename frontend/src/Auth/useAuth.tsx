import { useContext } from 'react';
import { AuthContext } from './AuthContext';  // Adjust the import path based on your file structure

export function useAuth() {
  return useContext(AuthContext);
}