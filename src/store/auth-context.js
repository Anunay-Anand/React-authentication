// Importing React and other libraries
import React, { useState } from "react";

// Creating our context
const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

// We need to wrap the entire components with Auth Context Provider.
// So instead of wrapping wr simply create a component with provider inside and use it in app for context
export const AuthContextProvider = (props) => {
  // Managing the state for the token inside context
  const [token, setToken] = useState(null);

  // Check if user is loggedIn
  const userLoggedIn = !!token;

  // Create a login Handler
  const loginHandler = (token) => {
    setToken(token);
  };

  // Create a logout Handler
  const logoutHandler = () => {
    setToken(null);
  };

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
