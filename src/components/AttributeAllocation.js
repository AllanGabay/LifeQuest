import React, { useState, useEffect } from 'react';

const explanations = {
  "Bien-être": "Bien-être (Vitalité)\n\nDans ce monde, ta forme physique et mentale sont les fondations de ta puissance. La catégorie Bien-être mesure ton équilibre entre ton corps et ton esprit. À mesure que tu accomplis des quêtes qui renforcent ta santé physique (comme l'exercice ou le sommeil) et ton calme intérieur (comme la gestion du stress ou la méditation), ta vitalité augmente. Une bonne vitalité te permet de mieux résister aux malus et aux obstacles, tout en te donnant l'énergie nécessaire pour réussir toutes tes autres quêtes.",
  "Productivité": "Productivité (Discipline du Maître du Temps)\n\nProductivité est l'attribut du héros capable d'accomplir ses quêtes rapidement et avec précision. Elle représente ta capacité à organiser et réaliser tes tâches avec fluidité. Plus tu développes cette compétence, plus tu réduis les délais et maximises ton rendement. Les guerriers les plus efficaces planifient leur journée comme des généraux avant une bataille et exécutent leurs plans sans laisser de place au hasard.",
  "Apprentissage": "Apprentissage (Savoir et Technique)\n\nL' Apprentissage est l'alliée des érudits et des artisans. Plus tu accumules de connaissances et pratiques tes compétences, plus tu deviens un maître de ton art. Que tu sois en quête de nouvelles connaissances théoriques ou de compétences pratiques, cette catégorie reflète ton avancée vers la perfection.",
  "Interaction": "Interaction (Charisme et Diplomatie)\n\nDans le monde des interactions, tu n'es pas seul. Cette catégorie mesure ta capacité à tisser des liens, à négocier, et à collaborer avec les autres. Ton charisme et ta diplomatie te permettent de forger des alliances puissantes, de convaincre avec aisance, et d'établir des connexions profondes avec ceux qui t'entourent. Plus ton interaction est élevée, plus tu excelles dans l'art des relations et de la communication, ce qui te permet de naviguer aisément dans les environnements sociaux et professionnels.",
  "Résilience": "Résilience (Endurance et Persévérance)\n\nLa Résilience est la force qui te permet de continuer même lorsque les vents sont contraires. À mesure que tu maintiens tes streaks (séries de réussites continues), cette compétence te permet de t'améliorer et de ne pas faiblir face aux difficultés. Les guerriers résilients sont capables de se relever après chaque échec, et c'est en persévérant qu'ils finissent par remporter les plus grandes batailles."
};

const AttributeAllocation = ({ attributes = [], onAttributeChange }) => {
  const [remainingPoints, setRemainingPoints] = useState(5);

  useEffect(() => {
    const totalPoints = attributes.reduce((sum, attr) => sum + attr.level, 0);
    setRemainingPoints(5 - totalPoints);
  }, [attributes]);

  const handleIncrement = (index) => {
    if (remainingPoints > 0) {
      const newAttributes = [...attributes];
      newAttributes[index].level += 1;
      onAttributeChange(newAttributes);
    }
  };

  const handleDecrement = (index) => {
    if (attributes[index].level > 0) {
      const newAttributes = [...attributes];
      newAttributes[index].level -= 1;
      onAttributeChange(newAttributes);
    }
  };

  return (
    <div>
      <div className="remaining-points">Points restants: {remainingPoints}</div>
      {attributes.map((attribute, index) => (
        <div key={attribute.category_id} className="attribute-row">
          <label>
            <span>{attribute.category_name}</span>
          </label>
          <button className="decrement" onClick={() => handleDecrement(index)}>-</button>
          <input type="text" value={attribute.level} readOnly />
          <button className="increment" onClick={() => handleIncrement(index)}>+</button>
          <button className="info-button">
            ?
            <div className="tooltip">{explanations[attribute.category_name]}</div>
          </button>
        </div>
      ))}
    </div>
  );
};

export default AttributeAllocation;
