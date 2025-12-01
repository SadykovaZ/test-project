import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBeBck1QgYc7HfgLO9RVezNryqvVXpQ4OU",
  authDomain: "full-stack-react-cfd9a.firebaseapp.com",
  projectId: "full-stack-react-cfd9a",
  storageBucket: "full-stack-react-cfd9a.firebasestorage.app",
  messagingSenderId: "156375251814",
  appId: "1:156375251814:web:37bf5a00f31593ce7566a7",
};

initializeApp(firebaseConfig);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
