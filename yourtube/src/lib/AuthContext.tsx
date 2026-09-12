"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";

import { provider, auth } from "./firebase";

import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import axiosInstance from "./axiosInstance";

interface User {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  image?: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (userdata: User) => void;
  logout: () => Promise<void>;
  handlegooglesignin: () => Promise<void>;
}

interface UserProviderProps {
  children: ReactNode;
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = (userdata: User) => {
    if (!userdata) return;

    console.log("LOGIN USER:", userdata);
    setUser(userdata);

    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(userdata));
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Firebase sign out error:", error);
    }

    setUser(null);

    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
  };

  const handlegooglesignin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseuser = result.user;

      const payload = {
        email: firebaseuser.email,
        name: firebaseuser.displayName,
        image:
          firebaseuser.photoURL ||
          "https://github.com/shadcn.png",
      };

      const response = await axiosInstance.post(
        "/user/login",
        payload
      );

      console.log(
        "BACKEND LOGIN RESPONSE:",
        response.data
      );

      if (response?.data?.result) {
        login(response.data.result);
      }
    } catch (error: any) {
      console.error(
        "Google Sign-In Error:",
        error?.response?.data || error
      );
    }
  };

  useEffect(() => {
    let savedUser: User | null = null;

    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("user");

        if (saved) {
          savedUser = JSON.parse(saved);

          console.log(
            "RESTORED USER:",
            savedUser
          );

          setUser(savedUser);
        }
      } catch (error) {
        console.error(
          "LOCAL STORAGE ERROR:",
          error
        );

        localStorage.removeItem("user");
      }
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseuser) => {
        console.log(
          "FIREBASE AUTH STATE:",
          firebaseuser
        );

        if (firebaseuser) {
          try {
            const payload = {
              email: firebaseuser.email,
              name: firebaseuser.displayName,
              image:
                firebaseuser.photoURL ||
                "https://github.com/shadcn.png",
            };

            const response =
              await axiosInstance.post(
                "/user/login",
                payload
              );

            if (response?.data?.result) {
              login(response.data.result);
            } else if (savedUser) {
              setUser(savedUser);
            }
          } catch (error: any) {
            console.error(
              "SESSION RESTORE ERROR:",
              error?.response?.data || error
            );

            if (savedUser) {
              setUser(savedUser);
            }
          }
        } else {
          if (savedUser) {
            setUser(savedUser);
          } else {
            setUser(null);
          }
        }

        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        handlegooglesignin,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};