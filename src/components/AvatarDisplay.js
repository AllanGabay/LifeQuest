import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import '../styles/AvatarDisplay.css'; // Assurez-vous d'importer le fichier CSS
import baseAvatar from '../assets/base-avatar.png';
import hairstyle1 from '../assets/hairstyle1.png';
import hairstyle2 from '../assets/hairstyle2.png';
import bienetre from '../assets/bienetre.png';
import efficacite from '../assets/efficacite.png';
import maitrise from '../assets/maitrise.png';
import interaction from '../assets/interaction.png';
import resilience from '../assets/resilience.png';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, ChartTooltip, Legend);

const hairstyles = [hairstyle1, hairstyle2];
const categoryImages = [bienetre, efficacite, maitrise, interaction, resilience];

const categories = [
  { name: 'Bien-être', description: "Mesure ton équilibre entre ton corps et ton esprit. Améliore ta capacité à récupérer et réduit les pénalités liées à la fatigue ou au stress." },
  { name: 'Efficacité', description: "Représente ta capacité à organiser et réaliser tes tâches. Augmente la rapidité et la précision dans l'accomplissement des tâches." },
  { name: 'Maîtrise', description: "Te permet de débloquer des compétences spéciales. Augmente la vitesse d'apprentissage et renforce la capacité à acquérir de nouvelles compétences." },
  { name: 'Interaction', description: "Mesure ta capacité à tisser des liens et à communiquer. Améliore les chances de succès lors des collaborations et des négociations." },
  { name: 'Résilience', description: "La force qui te permet de continuer face aux difficultés. Réduit les impacts des échecs et augmente les récompenses pour les séries de réussites." },
];

const AvatarDisplay = ({ avatar }) => {
  const { hairstyle, attributes } = avatar;

  console.log("Attributs de l'avatar:", attributes); // Ajoutez ce log pour vérifier les attributs

  const categoryOrder = ['Bien-être', 'Efficacité', 'Maîtrise', 'Interaction', 'Résilience'];

  const orderedData = categoryOrder.map(category => attributes[category]?.level || 0);

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
        ticks: {
          display: false,
          beginAtZero: true,
          max: Math.max(...orderedData) + 1, // Ajuster le maximum en fonction du niveau le plus élevé
          min: 0
        }
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
