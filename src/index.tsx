import React from "react";
import ReactDOM from "react-dom/client";
import * as Sentry from "@sentry/react";
import "./index.css";
import App from "./App";
import * as FullStory from "@fullstory/browser";
import { SkinContextProvider } from "./context/SkinContext";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
FullStory.init({ orgId: "o-1KN8WV-na1" });
process.env.REACT_APP_SENTRY_URL &&
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_URL,
    integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,

    // Capture Replay for 10% of all sessions,
    // plus for 100% of sessions with an error
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
root.render(
  <React.StrictMode>
    <SkinContextProvider>
      <App />
    </SkinContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
