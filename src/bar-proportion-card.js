import styles from './bar-proportion-styles.js';
import { formatDisplay, processEntityData } from './bar-proportion-utils.js';
import './bar-proportion-editor.js';

class BarProportionCard extends HTMLElement {

  constructor() {
    super();
    console.log('[BarProportionCard] Constructor');
  }
  
  static getConfigElement() {
    console.log('[BarProportionCard] getConfigElement - creating editor');
    const editor = document.createElement('bar-proportion-card-editor');
    console.log('[BarProportionCard] getConfigElement - editor created:', editor);
    return editor;
  }
  
  static getStubConfig() {
    console.log('[BarProportionCard] getStubConfig called');
    return {
      title: "Ma barre de proportion",
      entities: [
        {
          entity: "",
          name: "",
          color: "var(--primary-color)"
        }
      ],
      display_mode: "percentage",
      decimals: 0,
      unit: ""
    };
  }

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

  updateCard() {
    const values = this.config.entities.map(entity => 
      processEntityData(entity, this._hass)
    );

    const total = values.reduce((sum, item) => sum + item.value, 0);
    
    this.content.innerHTML = `
      <style>${styles}</style>
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
              <span>${item.name} (${formatDisplay(item.value, total, this.config)})</span>
            </div>
          `).join('')}
        </div>
      </ha-card>
    `;
  }
}

customElements.define('bar-proportion-card', BarProportionCard);
