import React from 'react';
import '../styles/Dashboard.css';
import bienetre from '../assets/bienetre.png';
import efficacite from '../assets/efficacite.png';
import maitrise from '../assets/maitrise.png';
import interaction from '../assets/interaction.png';
import resilience from '../assets/resilience.png';
import { getExperienceToNextLevel } from '../utils/experience';

const categories = [
  { name: 'Bien-être', icon: bienetre },
  { name: 'Efficacité', icon: efficacite },
  { name: 'Maîtrise', icon: maitrise },
  { name: 'Interaction', icon: interaction },
  { name: 'Résilience', icon: resilience },
];

const Dashboard = ({ attributes, items }) => {
  // Vérifier si attributes est défini et est un tableau
  const hasValidAttributes = Array.isArray(attributes) && attributes.length > 0;

  // Vérifier si items est défini et est un tableau
  const hasValidItems = Array.isArray(items) && items.length > 0;

  return (
    <div className="dashboard">
      <h2>Tableau de bord</h2>
      {hasValidAttributes ? (
        <div className="categories-grid">
          {categories.map((category) => {
            const categoryData = attributes.find(attr => attr.category_name === category.name) || {};
            const level = categoryData.level || 0;
            const experience = categoryData.experience || 0;
            const experienceToNextLevel = getExperienceToNextLevel(level);

            return (
              <div key={category.name} className="category-card">
                <img src={category.icon} alt={category.name} className="category-icon" />
                <h3>{category.name}</h3>
                <span className="level-text">Niveau {level}</span>
                <div className="experience-bar-container">
                  <div 
                    className="experience-bar" 
                    style={{ width: `${(experience / experienceToNextLevel) * 100}%` }}
                  ></div>
                </div>
                <span className="experience-text">{experience} / {experienceToNextLevel} XP</span>
              </div>
            );
          })}
        </div>
      ) : (
        <p>Chargement des données...</p>
      )}
      <h2>Items Équipés</h2>
      {hasValidItems ? (
        <div className="items-grid">
          {items.filter(item => item.equipped).map(item => (
            <div key={item.item_id} className="item-card">
              <img src={item.image_url} alt={item.name} className="item-icon" />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      ) : (
        <p>Aucun item équipé</p>
      )}
    </div>
  );
};

export default Dashboard;
