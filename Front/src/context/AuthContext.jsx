import { createContext, useContext, useMemo, useState } from 'react';
import { login as loginRequest } from '../api/authApi';

const AuthContext = createContext(null);
const STORAGE_KEY = 'buc_admin_session';

function readSession() {
  try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null'); }
  catch { return null; }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  const signIn = async (credentials) => {
    const result = await loginRequest(credentials);
    if (!result?.token || !result?.user) throw new Error('استجابة تسجيل الدخول غير مكتملة من الخادم');
    const nextSession = { token: result.token, user: result.user };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
    return nextSession.user;
  };

  const signOut = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setSession(null);
  };

  const value = useMemo(() => ({ ...session, signIn, signOut }), [session]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
