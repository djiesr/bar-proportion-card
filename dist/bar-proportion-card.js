class BarProportionCard extends HTMLElement {
  setConfig(config) {
    if (!config.entities || !Array.isArray(config.entities)) {
      throw new Error('Please define entities');
    }
    // Options par défaut
    this.config = {
      display_mode: 'percentage', // 'percentage' ou 'value'
      unit: '',                   // unité pour le mode 'value'
      decimals: 0,                // nombre de décimales
      ...config                   // fusionner avec les options fournies
    };
  }

  set hass(hass) {
    this._hass = hass;
    if (!this.content) {
      this.content = document.createElement('div');
      this.appendChild(this.content);
    }
    this.updateCard();
  }

  // Fonction pour formater l'affichage selon le mode choisi
  formatDisplay(value, total) {
    if (this.config.display_mode === 'percentage') {
      return `${(value / total * 100).toFixed(this.config.decimals)}%`;
    } else {
      return `${value.toFixed(this.config.decimals)}${this.config.unit}`;
    }
  }

  updateCard() {
    const values = this.config.entities.map(entity => {
      const state = this._hass.states[entity.entity];
      if (!state) {
        console.warn(`Entity ${entity.entity} not found`);
        return {
          name: entity.name || entity.entity,
          value: 0,
          color: entity.color || '#1a4bff'
        };
      }
      return {
        name: entity.name || state.attributes.friendly_name || entity.entity,
        value: parseFloat(state.state) || 0,
        color: entity.color || '#1a4bff'
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
            <div class="bar-section" 
                 style="width: ${(item.value / total * 100)}%; background-color: ${item.color};">
            </div>
          `).join('')}
        </div>

        <div class="legend">
          ${values.map(item => `
            <div class="legend-item">
              <div class="legend-color" style="background-color: ${item.color};"></div>
              <span>${item.name} (${this.formatDisplay(item.value, total)})</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

customElements.define('bar-proportion-card', BarProportionCard);
