import React, { useState } from 'react';
import '../styles/HairstyleCarousel.css';

// Importez vos images de coiffure ici
import baseAvatar from '../assets/base-avatar.png';
import hairstyle0 from '../assets/null1.png';
import hairstyle1 from '../assets/blond1.png';
import hairstyle2 from '../assets/brown1.png';
import hairstyle3 from '../assets/cap1.png';
import hairstyle4 from '../assets/dollarhat1.png';


const hairstyles = [hairstyle0, hairstyle1, hairstyle2, hairstyle3, hairstyle4];

const HairstyleCarousel = ({ onHairstyleChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextHairstyle = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % hairstyles.length);
    onHairstyleChange((currentIndex + 1) % hairstyles.length);
  };

  const prevHairstyle = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + hairstyles.length) % hairstyles.length);
    onHairstyleChange((currentIndex - 1 + hairstyles.length) % hairstyles.length);
  };

  return (
    <div className="hairstyle-carousel">
      <div className="avatar-preview">
        <img src={baseAvatar} alt="Base Avatar" className="base-avatar" />
        <img src={hairstyles[currentIndex]} alt="Hairstyle" className="hairstyle" />
      </div>
      <div className="navigation-buttons">
        <button onClick={prevHairstyle}>Précédent</button>
        <button onClick={nextHairstyle}>Suivant</button>
      </div>
    </div>
  );
};

export default HairstyleCarousel;
