class BarProportionCard extends HTMLElement {
  set hass(hass) {
    this._hass = hass;
    if (!this.content) {
      this.content = document.createElement('div');
      this.appendChild(this.content);
    }
    this.updateCard();
  }

  setConfig(config) {
    if (!config.entities || !Array.isArray(config.entities)) {
      throw new Error('Please define entities');
    }
    this.config = config;
  }

  updateCard() {
    const values = this.config.entities.map(entity => {
      const state = this._hass.states[entity.entity];
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

    const total = values.reduce((sum, item) => sum + item.value, 0);
    
    this.content.innerHTML = `
      <div class="card-content">
        ${this.config.title ? `<h2 class="card-header">${this.config.title}</h2>` : ''}
        
        <div class="bar-container">
          ${values.map(item => `
            <div class="bar-section ${item.color}" 
                 style="width: ${(item.value / total * 100)}%; min-width: ${item.value > 0 ? '1%' : '0'}">
              <div class="tooltip">
                ${item.name}: ${item.value} (${Math.round((item.value / total) * 100)}%)
              </div>
            </div>
          `).join('')}
        </div>

        ${this.config.show_legend !== false ? `
          <div class="legend">
            ${values.map(item => `
              <div class="legend-item">
                <div class="legend-color ${item.color}"></div>
                <span class="legend-label">
                  ${item.name} (${Math.round((item.value / total) * 100)}%)
                </span>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  getCardSize() {
    return 3;
  }

  static getStubConfig() {
    return {
      type: "custom:bar-proportion-card",
      title: "Bar Proportion",
      entities: []
    };
  }
}

customElements.define('bar-proportion-card', BarProportionCard);
