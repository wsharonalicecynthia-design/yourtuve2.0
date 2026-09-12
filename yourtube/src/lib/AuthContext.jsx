"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
} from "react";

import { provider, auth } from "./firebase";

import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import axiosInstance from "./axiosInstance";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  /*
  ==================================================
  USER
  ==================================================
  */

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);


  /*
  ==================================================
  LOGIN
  ==================================================
  */

  const login = (userdata) => {
    if (!userdata) {
      return;
    }

    console.log(
      "LOGIN USER:",
      userdata
    );

    setUser(userdata);

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "user",
        JSON.stringify(userdata)
      );
    }
  };


  /*
  ==================================================
  LOGOUT
  ==================================================
  */

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(
        "Firebase sign out error:",
        error
      );
    }

    setUser(null);

    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
  };


  /*
  ==================================================
  GOOGLE SIGN IN
  ==================================================
  */

  const handlegooglesignin = async () => {
    try {
      const result =
        await signInWithPopup(
          auth,
          provider
        );

      const firebaseuser =
        result.user;

      const payload = {
        email:
          firebaseuser.email,

        name:
          firebaseuser.displayName,

        image:
          firebaseuser.photoURL ||
          "https://github.com/shadcn.png",
      };


      const response =
        await axiosInstance.post(
          "/user/login",
          payload
        );


      console.log(
        "BACKEND LOGIN RESPONSE:",
        response.data
      );


      if (
        response?.data?.result
      ) {
        login(
          response.data.result
        );
      }

    } catch (error) {

      console.error(
        "Google Sign-In Error:",
        error?.response?.data ||
          error
      );

    }
  };


  /*
  ==================================================
  RESTORE SESSION
  ==================================================
  */

  useEffect(() => {

    let savedUser = null;


    /*
    ================================================
    RESTORE FROM LOCAL STORAGE
    ================================================
    */

    if (
      typeof window !==
      "undefined"
    ) {

      try {

        const saved =
          localStorage.getItem(
            "user"
          );


        if (saved) {

          savedUser =
            JSON.parse(saved);


          console.log(
            "RESTORED USER:",
            savedUser
          );


          setUser(
            savedUser
          );

        }

      } catch (error) {

        console.error(
          "LOCAL STORAGE ERROR:",
          error
        );

        localStorage.removeItem(
          "user"
        );

      }

    }


    /*
    ================================================
    FIREBASE AUTH STATE
    ================================================
    */

    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (firebaseuser) => {

          console.log(
            "FIREBASE AUTH STATE:",
            firebaseuser
          );


          /*
          ==========================================
          USER IS SIGNED IN
          ==========================================
          */

          if (firebaseuser) {

            try {

              const payload = {
                email:
                  firebaseuser.email,

                name:
                  firebaseuser.displayName,

                image:
                  firebaseuser.photoURL ||
                  "https://github.com/shadcn.png",
              };


              const response =
                await axiosInstance.post(
                  "/user/login",
                  payload
                );


              if (
                response?.data?.result
              ) {

                login(
                  response.data.result
                );

              } else if (
                savedUser
              ) {

                setUser(
                  savedUser
                );

              }

            } catch (error) {

              console.error(
                "SESSION RESTORE ERROR:",
                error?.response?.data ||
                  error
              );


              /*
              Keep local user if
              backend temporarily fails.
              */

              if (savedUser) {

                setUser(
                  savedUser
                );

              }

            }


          /*
          ==========================================
          NO FIREBASE USER
          ==========================================
          */

          } else {

            /*
            Do NOT delete localStorage here.
            */

            if (savedUser) {

              setUser(
                savedUser
              );

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


  /*
  ==================================================
  PROVIDER
  ==================================================
  */

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


/*
====================================================
HOOK
====================================================
*/

export const useUser = () => {
  return useContext(
    UserContext
  );
};