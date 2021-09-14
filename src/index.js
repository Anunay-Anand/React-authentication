// Import React and other Important libraries
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

// Import css and other assets
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./store/auth-context";

ReactDOM.render(
  <AuthContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthContextProvider>,
  document.getElementById("root")
);
