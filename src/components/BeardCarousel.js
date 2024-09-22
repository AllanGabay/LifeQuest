import React, { useState } from 'react';
import '../styles/BeardCarousel.css';
import baseAvatar from '../assets/base-avatar.png';
import beard0 from '../assets/null1.png';
import beard1 from '../assets/beard1.png';
import beard2 from '../assets/moustache2.png';

// ... importez d'autres styles de barbe si nécessaire ...

const BeardCarousel = ({ onBeardChange }) => {
  const [currentBeard, setCurrentBeard] = useState(0);
  const beards = [null, beard0,beard1, beard2]; // Ajoutez d'autres styles de barbe si nécessaire

  const handlePrevious = () => {
    setCurrentBeard((prev) => (prev === 0 ? beards.length - 1 : prev - 1));
    onBeardChange(currentBeard);
  };

  const handleNext = () => {
    setCurrentBeard((prev) => (prev === beards.length - 1 ? 0 : prev + 1));
    onBeardChange(currentBeard);
  };

  return (
    <div className="beard-carousel">
      <div className="avatar-preview">
        <img src={baseAvatar} alt="Base Avatar" className="base-avatar" />
        {beards[currentBeard] && (
          <img src={beards[currentBeard]} alt="Beard" className="beard" />
        )}
      </div>
      <div className="carousel-controls">
        <button onClick={handlePrevious}>Précédent</button>
        <button onClick={handleNext}>Suivant</button>
      </div>
    </div>
  );
};

export default BeardCarousel;
