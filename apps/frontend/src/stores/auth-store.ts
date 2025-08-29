import { ActiveUser } from '@/hooks/use-user-query';
import { getCookie, removeCookie, setCookie } from '@/lib/cookies';
import { create } from 'zustand';

export const ACCESS_TOKEN = 'order-invoices_access_token';

interface AuthState {
  auth: {
    user: ActiveUser | null;
    setUser: (user: ActiveUser | null) => void;
    accessToken: string;
    setAccessToken: (accessToken: string, refreshToken: string) => void;
    resetAccessToken: () => void;
    reset: () => void;
  };
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieState = getCookie(ACCESS_TOKEN);
  const initToken = cookieState ? JSON.parse(cookieState) : '';
  return {
    auth: {
      user: null,
      setUser: (user) => set((state) => ({ ...state, auth: { ...state.auth, user } })),
      accessToken: initToken,
      setAccessToken: (accessToken, refreshToken) =>
        set((state) => {
          setCookie(ACCESS_TOKEN, JSON.stringify(accessToken));
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          return { ...state, auth: { ...state.auth, accessToken, refreshToken } };
        }),
      resetAccessToken: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN);
          return { ...state, auth: { ...state.auth, accessToken: '', refreshToken: '' } };
        }),
      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN);
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '', refreshToken: '' },
          };
        }),
    },
  };
});
