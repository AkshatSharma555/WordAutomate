import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./config/authConfig";

// 👇 1. Yahan ReactGA import kiya
import ReactGA from "react-ga4";

// 👇 2. Yahan Initialize kiya (App render hone se pehle)
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

if (GA_MEASUREMENT_ID) {
  ReactGA.initialize(GA_MEASUREMENT_ID);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </React.StrictMode>,
);