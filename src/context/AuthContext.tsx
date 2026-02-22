"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import * as api from "@/lib/api";

interface User {
  nickname: string;
  email: string;
  birth: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const fetchMe = async (token: string) => {
    const response = await fetch("https://api.baebulook.site/api/v1/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
      },
    });

    if (response.ok) {
      const userData = await response.json();
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      throw new Error("Failed to fetch user info");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchMe(token).catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const params = new URLSearchParams();
      params.append("grant_type", "password");
      params.append("username", email);
      params.append("password", password);

      const response = await fetch(
        "https://api.baebulook.site/api/v1/auth/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params,
        }
      );

      if (!response.ok) {
        let errorMessage =
          "로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요.";
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorMessage = Array.isArray(errorData.message)
              ? errorData.message.join("\n")
              : errorData.message;
          }
        } catch (e) {
          // ignore
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        await fetchMe(data.access_token);
        closeLoginModal();
      } else {
        throw new Error("Access token not found in response");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      alert(error.message);
      throw error; // Re-throw to handle loading state in UI
    }
  };

  const logout = async () => {
    await api.logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
