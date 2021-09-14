// Importing React and other libraries
import { useState, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";

// Importing custom components
import AuthContext from "../../store/auth-context";

// Importing Css Modules and other assets
import classes from "./AuthForm.module.css";

const AuthForm = () => {
  // Creating our own history object
  const history = useHistory();

  // Using Hooks for different purposes
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  // Using context to set App wide state
  const authCtx = useContext(AuthContext);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  // Submitting the form Data
  const submitHandler = (event) => {
    // prevent the default http request
    event.preventDefault();

    // Fetching the value using Reference
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    setIsLoading(true);
    let url;
    // Check if is loggedIn
    if (isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCHlh7h5W8NuKavjKRp8ui0pVb4PKWitAE";
    } else {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCHlh7h5W8NuKavjKRp8ui0pVb4PKWitAE";
    }
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            // show an error modal
            let errorMessage = "authentication failed";
            // We check all the possible condition to make sure we have error to print
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        // Change the exprires in hour time to actual currenttime + extra time in milliseconds
        const expirationTime = new Date(
          new Date().getTime() + +data.expiresIn * 1000
        );
        // Use context to set the state to loggedIn
        authCtx.login(data.idToken, expirationTime);
        // Redirecting the user
        history.replace("/");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" ref={emailInputRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            ref={passwordInputRef}
            required
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}
          {isLoading && <p>Sending a Request!!</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
