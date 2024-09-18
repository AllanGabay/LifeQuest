import React, { useState } from 'react';
import '../styles/HairstyleCarousel.css';

// Importez vos images de coiffure ici
import baseAvatar from '../assets/base-avatar.png';
import hairstyle1 from '../assets/hairstyle1.png';
import hairstyle2 from '../assets/hairstyle2.png';

const hairstyles = [hairstyle1, hairstyle2];

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
      <div className="carousel-controls">
        <button onClick={prevHairstyle}>Précédent</button>
        <button onClick={nextHairstyle}>Suivant</button>
      </div>
    </div>
  );
};

export default HairstyleCarousel;
