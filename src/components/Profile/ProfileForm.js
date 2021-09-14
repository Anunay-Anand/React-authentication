// Importing React and other Important libraries
import React, { useState, useRef, useContext } from "react";
import { useHistory } from "react-router";
import axios from "axios";

// Importing custom components
import AuthContext from "../../store/auth-context";

// Importing css modules and other assets
import classes from "./ProfileForm.module.css";

const ProfileForm = () => {
  // Fetch the password with Ref
  const newPasswordInputRef = useRef();
  const [isValid, setIsValid] = useState(true);

  // getting the history object
  const history = useHistory();

  // Using context to get token
  const authContext = useContext(AuthContext);

  // Using the submission handler
  const submitHandler = (event) => {
    event.preventDefault();

    // Getting the input password
    const enteredNewPassword = newPasswordInputRef.current.value;

    // Check if valid
    if (enteredNewPassword.trim() === "") {
      setIsValid(false);
      return;
    }

    // Data to be sent
    const data = JSON.stringify({
      idToken: authContext.token,
      password: enteredNewPassword,
      returnSecureToken: false,
    });

    // Send the valid password to the endpoint to change password
    axios
      .post(
        "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCHlh7h5W8NuKavjKRp8ui0pVb4PKWitAE",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        // console.log(response.data);
        history.replace("/");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        {!isValid && <p>Please re enter the Password !!</p>}
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          minLength="7"
          ref={newPasswordInputRef}
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
