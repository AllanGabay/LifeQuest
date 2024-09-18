import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import './App.css';
import backgroundImage from './assets/pixel-art-background.png';
import AvatarCreation from './components/AvatarCreation';
import AvatarDisplay from './components/AvatarDisplay';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        await loadAvatar(user.uid);
      } else {
        setAvatar(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadAvatar = async (userId) => {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().avatar) {
      setAvatar(docSnap.data().avatar);
    } else {
      setAvatar(null);
    }
  };

  const handleAvatarCreated = async (newAvatar) => {
    const avatarWithAttributes = {
      ...newAvatar,
      attributes: newAvatar.attributes || {} // Assurez-vous que attributes existe toujours
    };
    setAvatar(avatarWithAttributes);
    if (user) {
      await setDoc(doc(db, 'users', user.uid), { avatar: avatarWithAttributes }, { merge: true });
    }
  };

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
        loadAvatar(result.user.uid);
      })
      .catch((error) => {
        console.error("Erreur lors de la connexion:", error);
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

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="app-background" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="rpg-container">
        <div className="welcome-section">
          <div className="rpg-dialog">
            <h1>Bienvenue, {user ? user.displayName : 'aventurier'}!</h1>
            <p>Prêt pour l'aventure ?</p>
          </div>
          {user ? (
            <button className="rpg-button" onClick={handleSignOut}>
              Se déconnecter
            </button>
          ) : (
            <button className="rpg-button" onClick={signInWithGoogle}>
              Se connecter avec Google
            </button>
          )}
        </div>
        {user && !avatar && (
          <AvatarCreation onAvatarCreated={handleAvatarCreated} />
        )}
        {user && avatar && avatar.attributes && (
          <div className="panels-container">
            <Draggable bounds="parent" defaultPosition={{x: -305, y: 111}}>
              <div className="draggable-panel avatar-panel">
                <AvatarDisplay avatar={avatar} />
              </div>
            </Draggable>
            <Draggable bounds="parent" defaultPosition={{x: 464, y: 0}}>
              <div className="draggable-panel dashboard-panel">
                <Dashboard attributes={avatar.attributes} />
              </div>
            </Draggable>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
