// Ajoutez ceci au début du fichier
const style = document.createElement('style');
style.textContent = `
  .card-content {
    padding: 16px;
  }
  .card-header {
    font-size: 1.2em;
    margin-bottom: 16px;
  }
  .bar-container {
    width: 100%;
    height: 32px;
    display: flex;
    border-radius: 8px;
    overflow: hidden;
    background: #f3f4f6;
    margin-bottom: 16px;
  }
  .bar-section {
    height: 100%;
    transition: width 0.5s;
    position: relative;
  }
  .tooltip {
    display: none;
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: #1f2937;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 10;
  }
  .bar-section:hover .tooltip {
    display: block;
  }
  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .legend-color {
    width: 16px;
    height: 16px;
    border-radius: 4px;
  }
  .legend-label {
    font-size: 14px;
  }
`;
document.head.appendChild(style);

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
