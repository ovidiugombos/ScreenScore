import React, { createContext, useState, useEffect } from "react";
import { auth } from "./firebase"; // Import the auth object from your firebase.js file
export const UserContext = createContext(null);
export const useUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Add an event listener to the Firebase auth object to listen for authentication changes
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // If the user is authenticated, update the user state with the authenticated user object
        setUser(authUser);
      } else {
        // If the user is not authenticated, set the user state to null
        setUser(null);
      }
    });

    // Clean up the event listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  return user;
};
