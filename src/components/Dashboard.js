import React from 'react';
import '../styles/Dashboard.css';
import bienetre from '../assets/bienetre.png';
import efficacite from '../assets/efficacite.png';
import maitrise from '../assets/maitrise.png';
import interaction from '../assets/interaction.png';
import resilience from '../assets/resilience.png';

const categories = [
  { name: 'Bien-être', icon: bienetre },
  { name: 'Efficacité', icon: efficacite },
  { name: 'Maîtrise', icon: maitrise },
  { name: 'Interaction', icon: interaction },
  { name: 'Résilience', icon: resilience },
];

const Dashboard = ({ attributes }) => {
  return (
    <div className="dashboard">
      <h2>Tableau de bord</h2>
      <div className="categories-grid">
        {categories.map((category) => (
          <div key={category.name} className="category-card">
            <img src={category.icon} alt={category.name} className="category-icon" />
            <h3>{category.name}</h3>
            <div className="experience-bar-container">
              <div 
                className="experience-bar" 
                style={{ width: `${(attributes[category.name] / 5) * 100}%` }}
              ></div>
            </div>
            <span className="experience-text">{attributes[category.name]} / 5</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
