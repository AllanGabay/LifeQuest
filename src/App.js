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
      let loadedAvatar = docSnap.data().avatar;
      
      // Vérifier et convertir la structure si nécessaire
      if (typeof loadedAvatar.attributes['Bien-être'] === 'number') {
        const convertedAttributes = {};
        for (const [key, value] of Object.entries(loadedAvatar.attributes)) {
          convertedAttributes[key] = { level: value, experience: 0 };
        }
        loadedAvatar = { ...loadedAvatar, attributes: convertedAttributes };
        
        // Mettre à jour Firebase avec la nouvelle structure
        await setDoc(doc(db, 'users', userId), { avatar: loadedAvatar }, { merge: true });
      }
      
      setAvatar(loadedAvatar);
    } else {
      setAvatar(null);
    }
  };

  const handleAvatarCreated = async (newAvatar) => {
    console.log("Avatar créé:", newAvatar); // Ajoutez ce log
    setAvatar(newAvatar);
    if (user) {
      await setDoc(doc(db, 'users', user.uid), { avatar: newAvatar }, { merge: true });
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

  const updateAttribute = (category, experienceGained) => {
    setAvatar(prevAvatar => {
      const updatedAttributes = { ...prevAvatar.attributes };
      const currentAttribute = updatedAttributes[category];
      
      let newExperience = currentAttribute.experience + experienceGained;
      let newLevel = currentAttribute.level;
      
      while (newExperience >= 100) {
        newLevel++;
        newExperience -= 100;
      }
      
      updatedAttributes[category] = { level: newLevel, experience: newExperience };
      
      const updatedAvatar = { ...prevAvatar, attributes: updatedAttributes };
      
      console.log("Mise à jour des attributs:", updatedAvatar); // Ajoutez ce log
      
      // Mise à jour dans Firebase
      if (user) {
        setDoc(doc(db, 'users', user.uid), { avatar: updatedAvatar }, { merge: true });
      }
      
      return updatedAvatar;
    });
  };

  const renderDraggable = (content, defaultPosition, panelClass) => (
    <Draggable
      bounds="parent"
      defaultPosition={defaultPosition}
      handle=".drag-handle"
    >
      <div className={`draggable-panel ${panelClass}`}>
        <div className="drag-handle">Déplacer</div>
        {content}
      </div>
    </Draggable>
  );

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
        {user && avatar && avatar.attributes && Object.keys(avatar.attributes).length > 0 && (
          <div className="panels-container">
            {renderDraggable(
              <AvatarDisplay avatar={avatar} />,
              {x: -305, y: 111},
              'avatar-panel'
            )}
            {renderDraggable(
              <Dashboard attributes={avatar.attributes} />,
              {x: 0, y: 400},
              'dashboard-panel'
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
