import React from 'react';
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
      <h2>Panneau d'administration</h2>
      <button onClick={createCategories}>Créer Catégories</button>
      <button onClick={createQuests}>Créer Quêtes</button>
      <button onClick={createItems}>Créer Items</button>
    </div>
  );
};

export default AdminPanel;
