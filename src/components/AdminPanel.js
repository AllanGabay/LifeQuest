import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable'; // Importer Draggable
import '../styles/AdminPanel.css'; // Assurez-vous d'importer le fichier CSS
import { db } from '../firebaseConfig';
import { collection, getDocs, doc, getDoc, addDoc, setDoc } from 'firebase/firestore';

const AdminPanel = () => {
  const [categories, setCategories] = useState([]);
  const [recurrences, setRecurrences] = useState([]);
  const [quests, setQuests] = useState([]);
  const [items, setItems] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const [showQuests, setShowQuests] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [showCreateQuest, setShowCreateQuest] = useState(false);
  const [showCreateItem, setShowCreateItem] = useState(false);

  const fetchCategories = async () => {
    const categoriesCollection = collection(db, 'categories');
    const categorySnapshot = await getDocs(categoriesCollection);
    const categoryList = categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCategories(categoryList);
  };

  const fetchRecurrences = async () => {
    const recurrencesCollection = collection(db, 'recurrences');
    const recurrenceSnapshot = await getDocs(recurrencesCollection);
    const recurrenceList = recurrenceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setRecurrences(recurrenceList);
  };

  const fetchQuests = async () => {
    const questsCollection = collection(db, 'quests');
    const questSnapshot = await getDocs(questsCollection);
    const questList = await Promise.all(
      questSnapshot.docs.map(async doc => {
        const data = doc.data();
        const categoryDoc = await getDoc(data.category_id);
        const recurrenceDoc = await getDoc(data.recurrence_id);
        return {
          id: doc.id,
          ...data,
          category_name: categoryDoc.exists() ? categoryDoc.data().name : 'Unknown',
          recurrence_type: recurrenceDoc.exists() ? recurrenceDoc.data().type : 'Unknown',
          is_unique: recurrenceDoc.exists() ? recurrenceDoc.data().unique : false
        };
      })
    );
    setQuests(questList);
  };

  const fetchItems = async () => {
    const itemsCollection = collection(db, 'items');
    const itemSnapshot = await getDocs(itemsCollection);
    const itemList = itemSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setItems(itemList);
  };

  useEffect(() => {
    fetchCategories();
    fetchRecurrences();
    fetchQuests();
    fetchItems();
  }, []);

  const createCategory = async (name) => {
    await addDoc(collection(db, 'categories'), { name });
    fetchCategories();
  };

  const createQuest = async (name, xp, description, category_id, recurrence_id, reward_items) => {
    await addDoc(collection(db, 'quests'), { name, xp, description, category_id, recurrence_id, reward_items: reward_items || [] });
    fetchQuests();
  };

  const createItem = async (name) => {
    await addDoc(collection(db, 'items'), { name });
    fetchItems();
  };

  const createRecurrences = async () => {
    const recurrences = [
      { id: 'daily', type: 'Journalière', unique: false },
      { id: 'weekly', type: 'Hebdomadaire', unique: false },
      { id: 'monthly', type: 'Mensuelle', unique: false },
      { id: 'unique', type: 'Unique', unique: true }
    ];

    const recurrencesCollection = collection(db, 'recurrences');
    for (const recurrence of recurrences) {
      await setDoc(doc(recurrencesCollection, recurrence.id), recurrence);
    }
    fetchRecurrences();
  };

  const createCategories = async () => {
    const categories = [
      { id: 'health', name: 'Santé' },
      { id: 'productivity', name: 'Productivité' },
      { id: 'learning', name: 'Apprentissage' },
      { id: 'social', name: 'Social' },
      { id: 'resilience', name: 'Résilience' }
    ];

    const categoriesCollection = collection(db, 'categories');
    for (const category of categories) {
      await setDoc(doc(categoriesCollection, category.id), category);
    }
    fetchCategories();
  };

  return (
    <div className="admin-panel">
      <h2>Panneau d'administration</h2>
      <div className="admin-buttons">
        <button onClick={() => setShowCategories(!showCategories)}>Afficher Catégories</button>
        <button onClick={() => setShowQuests(!showQuests)}>Afficher Quêtes</button>
        <button onClick={() => setShowItems(!showItems)}>Afficher Items</button>
        <button onClick={() => setShowCreateCategory(!showCreateCategory)}>Créer Catégorie</button>
        <button onClick={() => setShowCreateQuest(!showCreateQuest)}>Créer Quête</button>
        <button onClick={() => setShowCreateItem(!showCreateItem)}>Créer Item</button>
        <button onClick={createRecurrences}>Créer Récurrences</button>
        <button onClick={createCategories}>Créer Catégories</button>
      </div>
      <div className="admin-data">
        {showCategories && categories.length > 0 && (
          <div>
            <h3>Catégories</h3>
            <ul>
              {categories.map(category => (
                <li key={category.id}>{category.name}</li>
              ))}
            </ul>
          </div>
        )}
        {showQuests && quests.length > 0 && (
          <div>
            <h3>Quêtes</h3>
            <ul>
              {quests.map(quest => (
                <li key={quest.id}>
                  <strong>{quest.name}</strong><br />
                  <span>XP: {quest.xp}</span><br />
                  <span>Description: {quest.description}</span><br />
                  <span>Catégorie: {quest.category_name}</span><br />
                  <span>Récurrence: {quest.recurrence_type}</span><br />
                  <span>Unique: {quest.is_unique ? 'Oui' : 'Non'}</span><br />
                  <span>Récompenses: {quest.reward_items?.join(', ')}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {showItems && items.length > 0 && (
          <div>
            <h3>Items</h3>
            <ul>
              {items.map(item => (
                <li key={item.id}>{item.name}</li>
              ))}
            </ul>
          </div>
        )}
        {showCreateCategory && (
          <div>
            <h3>Créer Catégorie</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              createCategory(e.target.categoryName.value);
              e.target.reset();
            }}>
              <input type="text" name="categoryName" placeholder="Nom de la catégorie" required />
              <button type="submit">Créer</button>
            </form>
          </div>
        )}
        {showCreateQuest && (
          <div>
            <h3>Créer Quête</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              createQuest(
                e.target.questName.value,
                parseInt(e.target.questXP.value),
                e.target.questDescription.value,
                doc(db, 'categories', e.target.questCategory.value),
                doc(db, 'recurrences', e.target.questRecurrence.value),
                e.target.questRewards.value ? e.target.questRewards.value.split(',') : []
              );
              e.target.reset();
            }}>
              <input type="text" name="questName" placeholder="Nom de la quête" required />
              <input type="number" name="questXP" placeholder="XP" required />
              <input type="text" name="questDescription" placeholder="Description" required />
              <select name="questCategory" required>
                <option value="">Sélectionner une catégorie</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              <select name="questRecurrence" required>
                <option value="">Sélectionner une récurrence</option>
                {recurrences.map(recurrence => (
                  <option key={recurrence.id} value={recurrence.id}>{recurrence.type}</option>
                ))}
              </select>
              <input type="text" name="questRewards" placeholder="Récompenses (séparées par des virgules)" />
              <button type="submit">Créer</button>
            </form>
          </div>
        )}
        {showCreateItem && (
          <div>
            <h3>Créer Item</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              createItem(e.target.itemName.value);
              e.target.reset();
            }}>
              <input type="text" name="itemName" placeholder="Nom de l'item" required />
              <button type="submit">Créer</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
