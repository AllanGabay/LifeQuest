import React from 'react';
import '../styles/Quests.css';

const Quests = ({ quests, onCompleteQuest }) => {
  return (
    <div className="quests">
      <h2>Quêtes</h2>
      <div className="quests-list">
        {quests.map((quest, index) => (
          <div key={index} className="quest-card">
            <h3>{quest.title}</h3>
            <p>{quest.description}</p>
            <p>Catégorie : {quest.category}</p>
            <p>XP : {quest.xp}</p>
            <button onClick={() => onCompleteQuest(quest)}>Terminer la quête</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quests;
