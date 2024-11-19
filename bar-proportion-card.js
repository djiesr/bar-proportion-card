const style = document.createElement('style');
style.textContent = `
  .card-content {
    padding: 16px;
  }
  .card-header {
    font-size: 1.5em;
    margin-bottom: 24px;
    color: var(--primary-text-color);
  }
  .bar-container {
    width: 100%;
    height: 24px;
    display: flex;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 24px;
  }
  .bar-section {
    height: 100%;
    transition: width 0.5s;
    position: relative;
  }
  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 16px;
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .legend-color {
    width: 12px;
    height: 12px;
    border-radius: 3px;
  }
  .legend-label {
    font-size: 0.9em;
    color: var(--primary-text-color);
  }
  
  /* Couleurs spécifiques */
  .deep-sleep {
    background-color: #1a4bff;
  }
  .light-sleep {
    background-color: #63a4ff;
  }
  .rem-sleep {
    background-color: #3978ff;
  }
  .awake {
    background-color: #9e9e9e;
  }
`;

class BarProportionCard extends HTMLElement {
  // ... autres méthodes ...

  updateCard() {
    const values = this.config.entities.map(entity => {
      const state = this._hass.states[entity.entity];
      if (!state) {
        console.warn(`Entity ${entity.entity} not found`);
        return {
          name: entity.name || entity.entity,
          value: 0,
          color: entity.color || 'deep-sleep'
        };
      }
      return {
        name: entity.name || state.attributes.friendly_name || entity.entity,
        value: parseFloat(state.state) || 0,
        color: entity.color || 'deep-sleep'
      };
    });

    const total = values.reduce((sum, item) => sum + item.value, 0);
    
    this.content.innerHTML = `
      <style>
        .bar-container {
          width: 100%;
          height: 24px;
          display: flex;
          border-radius: 12px;
          overflow: hidden;
          background: #f0f0f0;
          margin: 16px 0;
        }
        .bar-section {
          height: 100%;
          transition: width 0.5s;
        }
        .deep-sleep { background-color: #1a4bff; }
        .light-sleep { background-color: #63a4ff; }
        .rem-sleep { background-color: #3978ff; }
        .awake { background-color: #9e9e9e; }
        .legend {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-top: 16px;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 3px;
        }
      </style>

      <div style="padding: 16px;">
        ${this.config.title ? `<h2 style="font-size: 1.5em; margin-bottom: 16px;">${this.config.title}</h2>` : ''}
        
        <div class="bar-container">
          ${values.map(item => `
            <div class="bar-section ${item.color}" 
                 style="width: ${(item.value / total * 100)}%;">
            </div>
          `).join('')}
        </div>

        <div class="legend">
          ${values.map(item => `
            <div class="legend-item">
              <div class="legend-color ${item.color}"></div>
              <span>${item.name} (${Math.round((item.value / total) * 100)}%)</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

customElements.define('bar-proportion-card', BarProportionCard);
