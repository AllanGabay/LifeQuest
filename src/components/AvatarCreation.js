import React, { useState } from 'react';
import HairstyleCarousel from './HairstyleCarousel';
import AttributeAllocation from './AttributeAllocation';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import '../styles/AvatarCreation.css';

const AvatarCreation = ({ onAvatarCreated }) => {
  const [selectedHairstyle, setSelectedHairstyle] = useState(0);
  const [attributes, setAttributes] = useState({
    'Bien-être': 0,
    'Efficacité': 0,
    'Maîtrise': 0,
    'Interaction': 0,
    'Résilience': 0
  });

  const handleHairstyleChange = (index) => {
    setSelectedHairstyle(index);
  };

  const handleAttributeChange = (newAttributes) => {
    setAttributes(newAttributes);
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          avatar: {
            hairstyle: selectedHairstyle,
            attributes: attributes
          }
        }, { merge: true });
        console.log('Avatar créé avec succès !');
        onAvatarCreated(); // Appeler cette fonction pour informer le composant parent
      } catch (error) {
        console.error("Erreur lors de la création de l'avatar:", error);
      }
    }
  };

  return (
    <div className="avatar-creation">
      <h2>Création de votre avatar</h2>
      <HairstyleCarousel onHairstyleChange={handleHairstyleChange} />
      <AttributeAllocation onAttributeChange={handleAttributeChange} />
      <button onClick={handleSubmit} className="submit-button">Créer l'avatar</button>
    </div>
  );
};

export default AvatarCreation;
