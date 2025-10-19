import React, { createContext, useState, Context, Dispatch, SetStateAction } from 'react';

interface AuthContextType {
  signedIn: boolean;
  setSignedIn: Dispatch<SetStateAction<boolean>>;
}

// Define a default value that matches AuthContextType
const defaultAuthContextValue: AuthContextType = {
  signedIn: false,
  setSignedIn: () => {},
};

export const AuthContext: Context<AuthContextType> = createContext(defaultAuthContextValue);

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [signedIn, setSignedIn] = useState(false);

  return (
    <AuthContext.Provider value={{ signedIn, setSignedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
