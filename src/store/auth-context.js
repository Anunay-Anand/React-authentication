// Importing React and other libraries
import React, { useState, useEffect, useCallback } from "react";

// Creating our context
const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

// Creating a global logout Timer
let logoutTimer;

// Helper for calucating expiration time for auto logout
const calculateRemainingTime = (expirationTime) => {
  // extracting both the time in millisecond by using getTime() method on Data object
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  // calculating the remaining time and returning it
  const remainingDuration = adjExpirationTime - currentTime;
  return remainingDuration;
};

// Helper function to check if the token isValid
const retrieveStoredToken = () => {
  // get the stored token and expiration time
  const storedToken = localStorage.getItem("token");
  const storedExpirationDate = localStorage.getItem("expirationTime");

  // Check if the time is valid or not or remove token
  const remainingTime = calculateRemainingTime(storedExpirationDate);

  if (remainingTime <= 60000) {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    return null;
  }
  // If it is valid send it back
  return {
    token: storedToken,
    duration: remainingTime,
  };
};

// We need to wrap the entire components with Auth Context Provider.
// So instead of wrapping wr simply create a component with provider inside and use it in app for context
export const AuthContextProvider = (props) => {
  // Get the token data and expiration time wether null or not
  const tokenData = retrieveStoredToken();
  let initialToken;
  // Check if tokenData
  if (tokenData) {
    // Get the initial token if it exists
    initialToken = tokenData.token;
  }
  // Managing the state for the token inside context
  const [token, setToken] = useState(initialToken);

  // Check if user is loggedIn
  const userLoggedIn = !!token;

  // Create a logout Handler
  const logoutHandler = useCallback(() => {
    setToken(null);
    // Removing token on loggin out
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    // Check if timer exists
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  // Create a login Handler
  const loginHandler = (token, expirationTime) => {
    setToken(token);
    // Setting the token in local storage for persistence
    // setting up the timer too for expiration
    localStorage.setItem("token", token);
    localStorage.setItem("expirationTime", expirationTime);

    // Using helper to get remainingTime
    const remainingTime = calculateRemainingTime(expirationTime);

    // Creating a timer for logginOut
    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  // Using useEffect to check Token Data and set new timer everytime it reloads
  useEffect(() => {
    if (tokenData) {
      console.log(tokenData.duration);
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  // Create a context value which will be passed from provider component
  const contextValue = {
    token,
    isLoggedIn: userLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
