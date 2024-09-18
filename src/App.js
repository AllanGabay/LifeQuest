import React, { useState, useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebaseConfig';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  if (user) {
    return (
      <div className="rpg-container">
        <div className="rpg-dialog">
          <h1>Bienvenue, {user.displayName}!</h1>
          <p>Vous êtes connecté et prêt pour l'aventure!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rpg-container">
      <div className="rpg-dialog">
        <h1>Bienvenue, aventurier!</h1>
        <p>Connectez-vous pour commencer votre quête.</p>
      </div>
      <button className="rpg-button" onClick={signInWithGoogle}>
        Se connecter avec Google
      </button>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default App;
