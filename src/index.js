import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { FirebaseContext } from './context/FirebaseContext';
import { ProvideAuth } from './context/AuthContext';
import { firebaseApp } from "./firebase/config";
import { ProvideSpotifyCred } from './context/SpotifyInstanceContext'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <FirebaseContext.Provider value={firebaseApp}>
      <ProvideAuth>
        <ProvideSpotifyCred>
          <App />
        </ProvideSpotifyCred>
      </ProvideAuth>
    </FirebaseContext.Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
