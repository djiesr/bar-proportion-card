import React, { useEffect, useState } from 'react';
import { useHass } from 'home-assistant-js-websocket';

const BarProportionCard = ({ config }) => {
  const hass = useHass();
  const [values, setValues] = useState([]);
  
  useEffect(() => {
    if (!hass || !config.entities || !Array.isArray(config.entities)) {
      return;
    }

    try {
      const data = config.entities.map(entity => {
        const state = hass.states[entity.entity];
        if (!state) {
          console.warn(`Entity ${entity.entity} not found`);
          return {
            name: entity.name || entity.entity,
            value: 0,
            color: entity.color || 'bg-blue-500'
          };
        }
        
        return {
          name: entity.name || state.attributes.friendly_name || entity.entity,
          value: parseFloat(state.state) || 0,
          color: entity.color || 'bg-blue-500'
        };
      });

      setValues(data);
    } catch (error) {
      console.error("Error processing entities:", error);
    }
  }, [hass, config.entities]);

  // Si pas de données valides, affiche un message
  if (!values.length) {
    return (
      <div className="p-4 text-center">
        Please configure entities for this card
      </div>
    );
  }

  // Calcule le total
  const total = values.reduce((sum, item) => sum + item.value, 0);

  // Si total est 0, évite la division par zéro
  if (total === 0) {
    return (
      <div className="p-4 text-center">
        No data available
      </div>
    );
  }

  return (
    <div className="w-full p-4 bg-card rounded-lg">
      {/* Titre de la carte */}
      {config.title && (
        <div className="mb-4">
          <h2 className="text-lg font-medium">{config.title}</h2>
        </div>
      )}
      
      {/* Barre de proportion */}
      <div className="w-full h-8 flex rounded-lg overflow-hidden mb-4 bg-gray-100">
        {values.map((item, index) => (
          <div 
            key={index}
            className={`${item.color} h-full transition-all duration-500 relative group`}
            style={{ 
              width: `${(item.value / total) * 100}%`,
              minWidth: item.value > 0 ? '1%' : '0'
            }}
          >
            {/* Tooltip au survol */}
            <div className="absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
              {`${item.name}: ${item.value} (${Math.round((item.value / total) * 100)}%)`}
            </div>
          </div>
        ))}
      </div>

      {/* Légende */}
      {config.show_legend !== false && (
        <div className="flex flex-wrap gap-4">
          {values.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className={`w-4 h-4 ${item.color} rounded`} />
              <span className="text-sm">
                {item.name} ({Math.round((item.value / total) * 100)}%)
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Configuration par défaut
BarProportionCard.defaultConfig = {
  show_legend: true
};

export default BarProportionCard;
