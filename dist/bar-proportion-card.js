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
      this.content.className = 'card-content';
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
      <ha-card>
        <style>
          :host {
            display: block;
            --ha-card-background: var(--card-background-color, white);
            --ha-card-border-radius: var(--ha-card-border-radius, 12px);
            --ha-card-box-shadow: var(--ha-card-box-shadow, none);
          }
          ha-card {
            overflow: hidden;
            background: var(--ha-card-background);
            border-radius: var(--ha-card-border-radius);
            box-shadow: var(--ha-card-box-shadow);
            padding: 16px;
          }
          .card-header {
            color: var(--primary-text-color);
            font-size: var(--ha-card-header-font-size, 24px);
            font-weight: var(--ha-card-header-font-weight, normal);
            letter-spacing: -0.012em;
            line-height: 32px;
            padding: 4px 0 12px;
            display: block;
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
            font-size: 14px;
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

        ${this.config.title ? `<div class="card-header">${this.config.title}</div>` : ''}
        
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
