// Importing React and other Important libraries
import React, { useContext } from "react";
import { Link } from "react-router-dom";

// Importing custom components
import AuthContext from "../../store/auth-context";

// Importing css modules from assets
import classes from "./MainNavigation.module.css";

const MainNavigation = () => {
  // Fetch all the context value to show navigation as loggedIn
  const authContext = useContext(AuthContext);
  const isLoggedIn = authContext.isLoggedIn;

  return (
    <header className={classes.header}>
      <Link to="/">
        <div className={classes.logo}>React Auth</div>
      </Link>
      <nav>
        <ul>
          {!isLoggedIn && (
            <li>
              <Link to="/auth">Login</Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          )}
          {/* Rendering logout button only when loggedIn */}
          {isLoggedIn && (
            <li>
              <button onClick={authContext.logout}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
