import React from 'react';
import Draggable from 'react-draggable'; // Importer Draggable
import '../styles/AdminPanel.css'; // Assurez-vous d'importer le fichier CSS
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const AdminPanel = () => {
  const createCategories = async () => {
    // ... code pour créer les catégories
  };

  const createQuests = async () => {
    // ... code pour créer les quêtes
  };

  const createItems = async () => {
    // ... code pour créer les items
  };

  return (
    <div className="admin-panel">
      {/* Supprimez l'un des boutons de déplacement */}
      <h2>Panneau d'administration</h2>
      <div className="admin-buttons">
        <button onClick={createCategories}>Créer Catégories</button>
        <button onClick={createQuests}>Créer Quêtes</button>
        <button onClick={createItems}>Créer Items</button>
      </div>
    </div>
  );
};

export default AdminPanel;
