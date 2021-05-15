import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import Router from "next/router";
import { setCookie, parseCookies, destroyCookie } from 'nookies';
import { api } from "../services/apiClient";

type ICredentential = {
  email: string;
  password: string;
}

type AuthProviderProps = {
  children: ReactNode;
}

type IUser = {
  email: string;
  permissions: string[];
  roles: string[];
}

type IAuthContextData = {
  signIn(credentials: ICredentential): Promise<void>;
  isAuthenticated: boolean;
  user: IUser;
}

const AuthContext = createContext({} as IAuthContextData);

export function signOut() {
  destroyCookie(undefined, 'nextauth.token');
  destroyCookie(undefined, 'nextauth.refreshToken');
  Router.push('/')
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<IUser>({} as IUser);

  useEffect(() => {
    const { 'nextauth.token': token } = parseCookies();
    if (token) {
      api.get('me').then(response => {
        setUser(response.data)
      }).catch(err => {
        signOut();
      });
    }
  }, []);

  async function signIn({ email, password }: ICredentential) {
    try {
      const response = await api.post('sessions', { email, password });

      const { token, refreshToken, permissions, roles } = response.data;

      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      });

      setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      });

      setUser({
        email,
        permissions,
        roles
      });

      api.defaults.headers['Authorization'] =  `Bearer ${token}`;

      Router.push('/dashboard')
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <AuthContext.Provider value={{ 
      signIn,
      isAuthenticated: !!user,
      user
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext); 