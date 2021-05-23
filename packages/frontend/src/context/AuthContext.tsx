import React, { useState, useCallback } from 'react';

import { AuthData, LoginData } from 'types';
import { login as loginRequest } from 'api/auth';

const getAuthDataFromStorage = (): AuthData | undefined => {
  try {
    const string = localStorage.getItem('authData');
    if (string === null) return;
    return JSON.parse(string);
  } catch (err) {
    return;
  }
};

interface AuthContextValues {
  authorized: boolean;
  authData?: AuthData;
  setAuthData: React.Dispatch<React.SetStateAction<AuthData | undefined>>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext({} as AuthContextValues);

export const AuthContextWrapper = ({ children }) => {
  const [authData, setAuthData] = useState<AuthData | undefined>(getAuthDataFromStorage());
  const authorized = Boolean(authData);

  const login = async (data: LoginData) => {
    const { token } = await loginRequest(data);
    const authData = { token, ...data };
    setAuthData(authData);
    localStorage.setItem('authData', JSON.stringify(data));
    localStorage.setItem('authToken', `Bearer ${token}`);
  };

  const logout = useCallback(async () => {
    setAuthData(undefined);
    localStorage.removeItem('authData');
    localStorage.removeItem('authToken');
  }, []);

  const values: AuthContextValues = {
    authorized,
    authData,
    setAuthData,
    login,
    logout
  };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export default AuthContext;
