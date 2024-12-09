import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./components/redux/store.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="719946023189-ubm4p73rhth2l0d8pf7edhng4mql60kd.apps.googleusercontent.com">
    <Router>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
    </GoogleOAuthProvider>
  </StrictMode>
);
