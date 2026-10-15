import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import "./styles.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="error-state">
          <p className="kicker">MIKA KAGAMI / DIGITAL UNIVERSE</p>
          <h1>Что-то пошло не так.</h1>
          <p>Попробуйте обновить страницу.</p>
          <button type="button" onClick={() => window.location.reload()}>Обновить</button>
        </main>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
