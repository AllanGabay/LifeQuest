import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import '../styles/QuestPanel.css';
import { categoryIcons } from '../config/icons';

const QuestPanel = ({ attributes, updateAttribute, addItem }) => {
  const [quests, setQuests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesCollection = collection(db, 'categories');
      const categorySnapshot = await getDocs(categoriesCollection);
      const categoryList = categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCategories(categoryList);
    };

    const fetchQuests = async () => {
      const questsCollection = collection(db, 'quests');
      const questSnapshot = await getDocs(questsCollection);
      const questList = questSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuests(questList);
    };

    fetchCategories();
    fetchQuests();
  }, []);

  const completeQuest = async (quest) => {
    const categoryName = categories.find(cat => cat.id === quest.category_id)?.name;
    if (categoryName && attributes.find(attr => attr.category_name === categoryName)) {
      const newAttributes = attributes.map(attr => {
        if (attr.category_name === categoryName) {
          return { ...attr, experience: attr.experience + quest.xp };
        }
        return attr;
      });
      updateAttribute(newAttributes);

      // Ajouter les items de récompense
      if (quest.reward_items) {
        quest.reward_items.forEach(item => {
          addItem(item);
        });
      }

      // Update quest status and record XP transaction in the database
      const userQuestsCollection = collection(db, 'userQuests');
      await addDoc(userQuestsCollection, {
        user_id: 'user_id', // Remplacez par l'ID de l'utilisateur actuel
        quest_id: quest.id,
        status: 'Complétée',
        completion_date: new Date()
      });

      const xpTransactionsCollection = collection(db, 'xpTransactions');
      await addDoc(xpTransactionsCollection, {
        user_id: 'user_id', // Remplacez par l'ID de l'utilisateur actuel
        quest_id: quest.id,
        xp_gained: quest.xp,
        transaction_date: new Date()
      });
    }
  };

  const filteredQuests = selectedCategory
    ? quests.filter(quest => quest.category_id === selectedCategory)
    : quests;

  return (
    <div className="quest-panel">
      <h2>Quêtes</h2>
      <div className="category-icons">
        <button
          className={!selectedCategory ? 'selected' : ''}
          onClick={() => setSelectedCategory(null)}
        >
          Tout
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            className={selectedCategory === category.id ? 'selected' : ''}
            onClick={() => setSelectedCategory(category.id)}
          >
            <img src={categoryIcons[category.name]} alt={category.name} className="category-icon" />
          </button>
        ))}
      </div>
      <ul>
        {filteredQuests.map(quest => (
          <li key={quest.id}>
            <span>{quest.name} - {quest.xp} XP</span>
            <button onClick={() => completeQuest(quest)}>Valider</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestPanel;
