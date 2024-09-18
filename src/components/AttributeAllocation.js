import React, { useState } from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import '../styles/AttributeAllocation.css';

const categories = [
  { name: 'Bien-être', description: 'Mesure ton équilibre entre ton corps et ton esprit. Améliore ta capacité à récupérer et réduit les pénalités liées à la fatigue ou au stress.' },
  { name: 'Efficacité', description: 'Représente ta capacité à organiser et réaliser tes tâches. Augmente la rapidité et la précision dans l'accomplissement des tâches.' },
  { name: 'Maîtrise', description: 'Te permet de débloquer des compétences spéciales. Augmente la vitesse d'apprentissage et renforce la capacité à acquérir de nouvelles compétences.' },
  { name: 'Interaction', description: 'Mesure ta capacité à tisser des liens et à communiquer. Améliore les chances de succès lors des collaborations et des négociations.' },
  { name: 'Résilience', description: 'La force qui te permet de continuer face aux difficultés. Réduit les impacts des échecs et augmente les récompenses pour les séries de réussites.' },
];

const AttributeAllocation = ({ onAttributeChange }) => {
  const [points, setPoints] = useState(5);
  const [attributes, setAttributes] = useState(
    Object.fromEntries(categories.map(cat => [cat.name, 0]))
  );

  const handleAttributeChange = (category, value) => {
    if ((points - value >= 0 && value > 0) || (attributes[category] > 0 && value < 0)) {
      const newAttributes = { ...attributes, [category]: attributes[category] + value };
      setAttributes(newAttributes);
      setPoints(points - value);
      onAttributeChange(newAttributes);
    }
  };

  return (
    <div className="attribute-allocation">
      <h3>Points restants: {points}</h3>
      {categories.map((category) => (
        <div key={category.name} className="attribute-row">
          <span>{category.name}: {attributes[category.name]}</span>
          <button onClick={() => handleAttributeChange(category.name, 1)} disabled={points === 0}>+</button>
          <button onClick={() => handleAttributeChange(category.name, -1)} disabled={attributes[category.name] === 0}>-</button>
          <span data-tooltip-id={category.name} data-tooltip-content={category.description}>?</span>
          <Tooltip id={category.name} />
        </div>
      ))}
    </div>
  );
};

export default AttributeAllocation;
