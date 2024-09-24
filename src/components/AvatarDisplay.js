import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import '../styles/AvatarDisplay.css';

// Register the necessary components
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, ChartTooltip, Legend);

// Importez toutes les images nécessaires
import baseAvatar from '../assets/base-avatar.png';
import hairstyle0 from '../assets/null1.png';
import hairstyle1 from '../assets/blond1.png';
import hairstyle2 from '../assets/brown1.png';
import hairstyle3 from '../assets/cap1.png';
import hairstyle4 from '../assets/dollarhat.png';
import beard0 from '../assets/null1.png';
import beard1 from '../assets/beard1.png';
import beard2 from '../assets/moustache1.png';

const hairstyles = [hairstyle0, hairstyle1, hairstyle2, hairstyle3, hairstyle4];
const beards = [beard0, beard1, beard2];

const categories = [
  { name: 'Bien-être', description: "Mesure ton équilibre entre ton corps et ton esprit. Améliore ta capacité à récupérer et réduit les pénalités liées à la fatigue ou au stress." },
  { name: 'Productivité', description: "Représente ta capacité à organiser et réaliser tes tâches. Augmente la rapidité et la précision dans l'accomplissement de tes objectifs." },
  { name: 'Apprentissage', description: "Te permet d'augmenter la vitesse d'apprentissage et renforce la capacité à acquérir de nouvelles compétences." },
  { name: 'Interaction', description: "Mesure ta capacité à tisser des liens et à communiquer. Améliore les chances de succès lors de collaborations et de négociations." },
  { name: 'Résilience', description: "La force qui te permet de continuer face aux difficultés. Réduit l'impacts des échecs grace aux séries de réussites." },
];

const AvatarDisplay = ({ avatar }) => {
  const { hairstyle, beard, attributes } = avatar;

  console.log("Attributs de l'avatar:", attributes); // Ajoutez ce log pour vérifier les attributs

  const categoryOrder = ['Bien-être', 'Productivité', 'Apprentissage', 'Interaction', 'Résilience'];

  const orderedData = categoryOrder.map(category => {
    const attribute = attributes.find(attr => attr.category_name === category);
    return attribute ? attribute.level : 0;
  });

  const maxLevel = Math.max(...orderedData);
  const suggestedMax = Math.ceil(maxLevel + (maxLevel / 8));
  console.log("Suggested Max Level:", suggestedMax); // Ajoutez ce log pour vérifier le calcul suggestedMax

  const data = {
    labels: categoryOrder,
    datasets: [
      {
        label: 'Niveaux',
        data: orderedData,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255, 99, 132, 1)'
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 255, 255, 0.3)'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.3)'
        },
        pointLabels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 12
          }
        },
        max: suggestedMax, // Définir le max ici
        ticks: {
          display: false,
          beginAtZero: true,
          stepSize: 1,
          color: 'rgba(255, 255, 255, 0.8)',
          backdropColor: 'rgba(0, 0, 0, 0.5)',
          backdropPadding: 2
        },
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw}`;
          }
        }
      }
    },
    maintainAspectRatio: true
  };

  return (
    <>
      <div className="avatar-display-container">
        <div className="avatar-display">
          <div className="avatar-image">
            <img src={baseAvatar} alt="Base Avatar" className="base-avatar" />
            <img src={hairstyles[hairstyle]} alt="Hairstyle" className="hairstyle" />
            <img src={beards[beard]} alt="Beard" className="beard" />
          </div>
          <div className="avatar-stats">
            <Radar data={data} options={options} />
          </div>
        </div>
      </div>
    </>
  );
};

export default AvatarDisplay;