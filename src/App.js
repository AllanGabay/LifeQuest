import React, { useState, useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import './App.css';
import backgroundImage from './assets/pixel-art-background.png';
import AvatarCreation from './components/AvatarCreation';

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [hasAvatar, setHasAvatar] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setHasAvatar(userDoc.exists() && userDoc.data().avatar);
      } else {
        setUser(null);
        setHasAvatar(false);
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

  const handleSignOut = () => {
    signOut(auth).then(() => {
      setUser(null);
      setHasAvatar(false);
    }).catch((error) => {
      console.error("Erreur lors de la déconnexion:", error);
    });
  };

  const handleAvatarCreated = () => {
    setHasAvatar(true);
  };

  if (user) {
    if (!hasAvatar) {
      return (
        <div className="rpg-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
          <AvatarCreation onAvatarCreated={handleAvatarCreated} />
          <button onClick={handleSignOut} className="rpg-button">Se déconnecter</button>
        </div>
      );
    }
    return (
      <div className="rpg-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="rpg-dialog">
          <h1>Bienvenue, {user.displayName}!</h1>
          <p>Vous êtes connecté et prêt pour l'aventure!</p>
        </div>
        <button onClick={handleSignOut} className="rpg-button">Se déconnecter</button>
      </div>
    );
  }

  return (
    <div className="rpg-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
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
