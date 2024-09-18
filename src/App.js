import React, { useState, useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import './App.css';
import backgroundImage from './assets/pixel-art-background.png';
import AvatarCreation from './components/AvatarCreation';
import AvatarDisplay from './components/AvatarDisplay';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().avatar) {
          setAvatar(userDoc.data().avatar);
        }
      } else {
        setUser(null);
        setAvatar(null);
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
      setAvatar(null);
    }).catch((error) => {
      console.error("Erreur lors de la déconnexion:", error);
    });
  };

  const handleAvatarCreated = (newAvatar) => {
    setAvatar(newAvatar);
  };

  if (!user) {
    return (
      <div className="rpg-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="welcome-section">
          <div className="rpg-dialog">
            <h1>Bienvenue, aventurier!</h1>
            <p>Connectez-vous pour commencer votre quête.</p>
          </div>
          <button className="rpg-button" onClick={signInWithGoogle}>
            Se connecter avec Google
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>
    );
  }

  return (
    <div className="rpg-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="welcome-section">
        <div className="rpg-dialog">
          <h1>Bienvenue, {user.displayName}!</h1>
          <p>Prêt pour l'aventure ?</p>
        </div>
        <button className="rpg-button" onClick={handleSignOut}>
          Se déconnecter
        </button>
      </div>
      {avatar ? (
        <>
          <AvatarDisplay avatar={avatar} />
          <Dashboard attributes={avatar.attributes} />
        </>
      ) : (
        <AvatarCreation onAvatarCreated={handleAvatarCreated} />
      )}
    </div>
  );
}

export default App;
