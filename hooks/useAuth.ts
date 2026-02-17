"use client";

import { useState, useEffect, useCallback } from "react";
import {
  signin as apiSignin,
  signup as apiSignup,
  getMe,
  setTokens,
  clearTokens,
  getAccessToken,
} from "@/utils/api";
import type { UserResponse, UserCreate } from "@/types/api";

interface UseAuthReturn {
  user: UserResponse | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (data: UserCreate) => Promise<void>;
  logout: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // 앱 시작 시 토큰이 있으면 유저 정보 복원
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }
    getMe()
      .then(setUser)
      .catch(() => {
        clearTokens();
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const tokenRes = await apiSignin(username, password);
    setTokens(tokenRes.access_token, tokenRes.refresh_token);
    const me = await getMe();
    setUser(me);
  }, []);

  const signup = useCallback(async (data: UserCreate) => {
    await apiSignup(data);
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  return {
    user,
    isLoggedIn: !!user,
    loading,
    login,
    signup,
    logout,
  };
}
