import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Auth0Provider } from "./react-auth0-spa";
import config from "./auth_config.json";
import history from "./utils/history";
import './index.css';



// A function that routes the user to the right place
// after login
const onRedirectCallback = appState => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

ReactDOM.render(
  <Auth0Provider
    domain={config.domain}
    client_id={config.clientId}
    redirect_uri={window.location.origin}
    onRedirectCallback={onRedirectCallback}
    audience={config.audience}     // NEW - specify the audience value
    scope={"read:journeysection write:traincomposition write:journeysection read:rollingstock write:rollingstock delete:rollingstock read:traction write:traction read:traincomposition read:train write:train read:wagon write:wagon"}
  >
    <App />
  </Auth0Provider>,
  document.getElementById("root")
);