class BarProportionCard extends HTMLElement {
  setConfig(config) {
    if (!config.entities || !Array.isArray(config.entities)) {
      throw new Error('Please define entities');
    }
    this.config = {
      display_mode: 'percentage',
      unit: '',
      decimals: 0,
      ...config
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
          color: entity.color || 'var(--primary-color)'
        };
      }
      return {
        name: entity.name || state.attributes.friendly_name || entity.entity,
        value: parseFloat(state.state) || 0,
        color: entity.color || 'var(--primary-color)'
      };
    });

    const total = values.reduce((sum, item) => sum + item.value, 0);
    
    this.content.innerHTML = `
      <style>
        ha-card {
          background: var(--ha-card-background, var(--card-background-color));
          border-radius: var(--ha-card-border-radius, 12px);
          box-shadow: var(--ha-card-box-shadow, 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12));
          color: var(--primary-text-color);
          padding: 16px;
        }
        .header {
          color: var(--primary-text-color);
          font-size: var(--ha-card-header-font-size, 24px);
          line-height: 1.2;
          margin-bottom: 16px;
          font-weight: normal;
        }
        .bar-container {
          width: 100%;
          height: 24px;
          display: flex;
          border-radius: 12px;
          overflow: hidden;
          background: var(--secondary-background-color);
          margin: 8px 0;
        }
        .bar-section {
          height: 100%;
          transition: width 0.5s ease-in-out;
        }
        .legend {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-top: 12px;
          color: var(--primary-text-color);
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
      <ha-card>
        ${this.config.title ? `<h1 class="header">${this.config.title}</h1>` : ''}
        
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
      </ha-card>
    `;
  }
}

customElements.define('bar-proportion-card', BarProportionCard);
