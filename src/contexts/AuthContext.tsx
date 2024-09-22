import React, { useState } from 'react';
import { Auth, InitialAuth } from '../data/auth/domain';

export interface AuthContextProps {
  authCredential: Auth;
  getAuthToken: () => string | null;
  saveAuth: (data: Auth, token: string) => void;
  removeAuth: () => void;
}

export const AuthContext = React.createContext<AuthContextProps | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = (props: AuthProviderProps) => {
  const { children } = props;
  const [authCredential, setAuthCredential] = useState<Auth>(Auth.create(InitialAuth));

  const getAuthToken = (): string | null => {
    return localStorage.getItem(process.env.AUTH_KEY as string);
  }

  const saveAuth = (data: Auth, token: string) => {
    localStorage.setItem(process.env.AUTH_KEY as string, token);
    setAuthCredential(Auth.create(data));
  };

  const removeAuth = () => {
    localStorage.removeItem(process.env.AUTH_KEY as string);
    localStorage.removeItem('delivery_note');
    setAuthCredential(Auth.create(InitialAuth));
  }

  return (
    <AuthContext.Provider value={{
      authCredential,
      getAuthToken,
      saveAuth,
      removeAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};
