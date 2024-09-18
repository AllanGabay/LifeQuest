import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import baseAvatar from '../assets/base-avatar.png';
import hairstyle1 from '../assets/hairstyle1.png';
import hairstyle2 from '../assets/hairstyle2.png';
import bienetre from '../assets/bienetre.png';
import efficacite from '../assets/efficacite.png';
import maitrise from '../assets/maitrise.png';
import interaction from '../assets/interaction.png';
import resilience from '../assets/resilience.png';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const hairstyles = [hairstyle1, hairstyle2];
const categoryImages = [bienetre, efficacite, maitrise, interaction, resilience];

const AvatarDisplay = ({ avatar }) => {
  const { hairstyle, attributes } = avatar;

  const data = {
    labels: ['Bien-être', 'Efficacité', 'Maîtrise', 'Interaction', 'Résilience'],
    datasets: [
      {
        label: 'Caractéristiques',
        data: Object.values(attributes),
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
          color: 'rgba(255, 255, 255, 0)',
          font: {
            size: 1
          }
        },
        ticks: {
          display: false,
          beginAtZero: true,
          max: 5,
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
    maintainAspectRatio: false
  };

  return (
    <div className="avatar-display">
      <div className="avatar-image">
        <img src={baseAvatar} alt="Base Avatar" className="base-avatar" />
        <img src={hairstyles[hairstyle]} alt="Hairstyle" className="hairstyle" />
      </div>
      <div className="avatar-stats">
        <Radar data={data} options={options} />
        <div className="stat-icons">
          {categoryImages.map((img, index) => (
            <img 
              key={index} 
              src={img} 
              alt={data.labels[index]} 
              className="stat-icon"
              style={{
                position: 'absolute',
                left: `${50 + 40 * Math.cos(index * Math.PI * 2 / 5 - Math.PI / 2)}%`,
                top: `${50 + 40 * Math.sin(index * Math.PI * 2 / 5 - Math.PI / 2)}%`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvatarDisplay;
