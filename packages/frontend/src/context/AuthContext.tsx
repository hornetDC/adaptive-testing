import React, { useState, useCallback } from 'react';

import { AuthData, LoginData } from 'types';
import { login as loginRequest } from 'api/auth';

interface AuthContextValues {
  authorized: boolean;
  authData?: AuthData;
  setAuthData: React.Dispatch<React.SetStateAction<AuthData | undefined>>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext({} as AuthContextValues);

export const AuthContextWrapper = ({ children }) => {
  const [authData, setAuthData] = useState<AuthData>();
  const authorized = Boolean(authData);

  const login = async (data: LoginData) => {
    const { token } = await loginRequest(data);
    setAuthData({ token, ...data });
  };

  const logout = useCallback(async () => {
    // await logoutRequest();
    setAuthData(undefined);
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
