import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";
import BgFx from "./BgFx.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BgFx />
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
