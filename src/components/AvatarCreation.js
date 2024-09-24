import React, { useState, useEffect } from 'react';
import AttributeAllocation from './AttributeAllocation';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import '../styles/AvatarCreation.css';

// Importez toutes les images nécessaires
import baseAvatar from '../assets/base-avatar.png';
import hairstyle0 from '../assets/null1.png';
import hairstyle1 from '../assets/blond1.png';
import hairstyle2 from '../assets/brown1.png';
import hairstyle3 from '../assets/cap1.png';
import hairstyle4 from '../assets/dollarhat.png';
import beard0 from '../assets/null1.png';
import beard1 from '../assets/beard1.png';
import beard2 from '../assets/moustache1.png';

const hairstyles = [hairstyle0, hairstyle1, hairstyle2, hairstyle3, hairstyle4];
const beards = [beard0, beard1, beard2];

const AvatarCreation = ({ onAvatarCreated }) => {
  const [selectedHairstyle, setSelectedHairstyle] = useState(0);
  const [selectedBeard, setSelectedBeard] = useState(0);
  const [pseudonym, setPseudonym] = useState('');
  const [attributes, setAttributes] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesCollection = collection(db, 'categories');
        const categorySnapshot = await getDocs(categoriesCollection);
        const categoryList = categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCategories(categoryList);

        // Initialize attributes with default values
        const initialAttributes = categoryList.map(category => ({
          category_id: category.id,
          category_name: category.name,
          experience: 0,
          level: 0
        }));
        setAttributes(initialAttributes);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleHairstyleChange = (direction) => {
    setSelectedHairstyle((prev) => (prev + direction + hairstyles.length) % hairstyles.length);
  };

  const handleBeardChange = (direction) => {
    setSelectedBeard((prev) => (prev + direction + beards.length) % beards.length);
  };

  const handleAttributeChange = (newAttributes) => {
    setAttributes(newAttributes);
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const newAvatar = {
          hairstyle: selectedHairstyle,
          beard: selectedBeard,
          attributes: attributes,
          items: [],
        };
        await setDoc(doc(db, 'users', user.email), {
          avatar: newAvatar,
          pseudonym: pseudonym
        }, { merge: true });
        console.log('Avatar créé avec succès !');
        onAvatarCreated(newAvatar);
      } catch (error) {
        console.error("Erreur lors de la création de l'avatar:", error);
      }
    }
  };

  return (
    <div className="avatar-creation">
      <h2>{"Création de\nvotre avatar"}</h2>
      <input
        type="text"
        placeholder="Pseudonyme"
        value={pseudonym}
        onChange={(e) => setPseudonym(e.target.value)}
        className="pseudonym-input"
      />
      <div className="avatar-preview">
        <img src={baseAvatar} alt="Base Avatar" className="base-avatar" />
        <img src={hairstyles[selectedHairstyle]} alt="Hairstyle" className="hairstyle" />
        <img src={beards[selectedBeard]} alt="Beard" className="beard" />
      </div>
      <div className="avatar-controls">
        <button onClick={() => handleHairstyleChange(-1)}>Précédent</button>
        <span>Coiffure</span>
        <button onClick={() => handleHairstyleChange(1)}>Suivant</button>
      </div>
      <div className="avatar-controls">
        <button onClick={() => handleBeardChange(-1)}>Précédent</button>
        <span>Barbe</span>
        <button onClick={() => handleBeardChange(1)}>Suivant</button>
      </div>
      <AttributeAllocation attributes={attributes} onAttributeChange={handleAttributeChange} />
      <button onClick={handleSubmit} className="submit-button">Créer l'avatar</button>
    </div>
  );
};

export default AvatarCreation;