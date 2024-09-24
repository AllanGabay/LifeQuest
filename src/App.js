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
import QuestPanel from './components/QuestPanel';
import AdminPanel from './components/AdminPanel';

function App() {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        await loadAvatar(user.email);
        if (user.email === 'gabay.allan@gmail.com') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setAvatar(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadAvatar = async (userEmail) => {
    const docRef = doc(db, 'users', userEmail);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().avatar) {
      let loadedAvatar = docSnap.data().avatar;

      if (typeof loadedAvatar.attributes['Bien-être'] === 'number') {
        const convertedAttributes = {};
        for (const [key, value] of Object.entries(loadedAvatar.attributes)) {
          convertedAttributes[key] = { level: value, experience: 0 };
        }
        loadedAvatar = { ...loadedAvatar, attributes: convertedAttributes };

        await setDoc(doc(db, 'users', userEmail), { avatar: loadedAvatar }, { merge: true });
      }

      setAvatar(loadedAvatar);
      console.log("L'utilisateur a déjà créé un avatar.");
    } else {
      setAvatar(null);
      console.log("L'utilisateur n'a pas encore créé d'avatar.");
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

  if (loading) {
    return <div>Chargement...</div>;
  }

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
        loadAvatar(result.user.email);
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
        setIsAdmin(false);
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

  if (!user) {
    return (
      <div className="login-page">
        <div className="login-container">
          <img src={backgroundImage} alt="LifeQuest" className="login-image" />
          <h1 className="login-title">LifeQuest</h1>
          <button onClick={signInWithGoogle} className="login-button">Sign In with Google</button>
        </div>
      </div>
    );
  }

  return (
    <div className="App logged-in">
 
      <header className="App-header">
        <h1>LifeQuest</h1>
        <button onClick={handleSignOut} className="logout-button">Se déconnecter</button>
      </header>
        {user && (
          <div className="App-content">
            {!avatar ? (
              <AvatarCreation onAvatarCreated={handleAvatarCreated} />
            ) : (
              <>
                {renderDraggable(<AvatarDisplay avatar={avatar} />, { x: 300, y: 100 }, 'avatar-display')}
                {renderDraggable(<Dashboard attributes={avatar.attributes} items={avatar.items} />, { x: 500, y: 100 }, 'dashboard')}
                {renderDraggable(<QuestPanel attributes={avatar.attributes} updateAttribute={updateAttribute} addItem={addItem} />, { x: 700, y: 100 }, 'quest-panel')}
                {isAdmin && renderDraggable(<AdminPanel />, { x: 600, y: 200 }, 'admin-panel')}
              </>
            )}
          </div>
        )}
   
    </div>

  );
}

export default App;