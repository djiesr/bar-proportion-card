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
      <div class="w-full p-4 bg-white rounded-lg shadow">
        ${this.config.title ? `<h2 class="text-lg font-medium mb-4">${this.config.title}</h2>` : ''}
        
        <div class="w-full h-8 flex rounded-lg overflow-hidden mb-4 bg-gray-100">
          ${values.map(item => `
            <div class="${item.color} h-full transition-all duration-500 relative group" 
                 style="width: ${(item.value / total * 100)}%; min-width: ${item.value > 0 ? '1%' : '0'}">
              <div class="absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
                ${item.name}: ${item.value} (${Math.round((item.value / total) * 100)}%)
              </div>
            </div>
          `).join('')}
        </div>

        ${this.config.show_legend !== false ? `
          <div class="flex flex-wrap gap-4">
            ${values.map(item => `
              <div class="flex items-center gap-2">
                <div class="${item.color} w-4 h-4 rounded"></div>
                <span class="text-sm">
                  ${item.name} (${Math.round((item.value / total) * 100)}%)
                </span>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('bar-proportion-card', BarProportionCard);
