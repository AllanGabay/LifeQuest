import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import './App.css';
import backgroundImage from './assets/pixel-art-background.png';
import AvatarCreation from './components/AvatarCreation';
import AvatarDisplay from './components/AvatarDisplay';
import Dashboard from './components/Dashboard';
import QuestPanel from './components/QuestPanel'; // Importer le nouveau composant
import AdminPanel from './components/AdminPanel'; // Importez le composant AdminPanel

function App() {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

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

  const handleAvatarCreated = (newAvatar) => {
    setAvatar(newAvatar);
  };

  const updateAttribute = (newAttributes) => {
    setAvatar(prevAvatar => ({
      ...prevAvatar,
      attributes: newAttributes
    }));
  };

  const addItem = (newItem) => {
    setAvatar(prevAvatar => ({
      ...prevAvatar,
      items: [...prevAvatar.items, newItem]
    }));
  };

  useEffect(() => {
    const fetchAvatar = async () => {
      const user = auth.currentUser;
      if (user) {
        // Vérifiez si l'utilisateur est votre compte Google personnel
        if (user.email === 'gabay.allan@gmail.com') {
          setIsAdmin(true);
        }
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setAvatar(userDoc.data().avatar);
        }
      }
    };

    fetchAvatar();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
        loadAvatar(result.user.uid);
      })
      .catch((error) => {
        console.error("Erreur lors de la connexion avec Google:", error);
      });
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        setAvatar(null);
      })
      .catch((error) => {
        console.error("Erreur lors de la déconnexion:", error);
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
              {x: 0, y: 0},
              'avatar-panel'
            )}
            {renderDraggable(
              <Dashboard attributes={avatar.attributes} items={avatar.items || []} />,
              {x: 0, y: 0},
              'dashboard-panel'
            )}
            {renderDraggable(
              <QuestPanel avatar={avatar} updateAttribute={updateAttribute} addItem={addItem} />, // Ajouter le panneau de quêtes
              {x: 0, y: 0},
              'quest-panel'
            )}
          </div>
        )}
        {isAdmin && <AdminPanel />} {/* Affichez le panneau d'administration si l'utilisateur est un admin */}
      </div>
    </div>
  );
}

export default App;
