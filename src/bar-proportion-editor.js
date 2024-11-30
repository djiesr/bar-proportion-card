class BarProportionCardEditor extends HTMLElement {
  static get styles() {
    return `
      .card-config {
        padding: 16px;
      }
      .row {
        display: flex;
        flex-direction: column;
        margin-top: 8px;
      }
      .entities {
        margin-top: 8px;
      }
      .entity-row {
        display: flex;
        gap: 8px;
        margin-top: 8px;
        align-items: center;
      }
    `;
  }

  static getStubConfig() {
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

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = BarProportionCardEditor.getStubConfig();
  }

  set hass(hass) {
    this._hass = hass;
    this.render();
  }

  setConfig(config) {
    this._config = config;
    this.render();
  }

  render() {
    if (!this._hass) return;

    this.shadowRoot.innerHTML = `
      <style>${BarProportionCardEditor.styles}</style>
      <div class="card-config">
        <div class="row">
          <ha-textfield
            label="Titre"
            .value="${this._config.title || ''}"
            @change="${this._valueChanged}"
            .configValue=${'title'}
          ></ha-textfield>
        </div>

        <div class="row">
          <ha-select
            label="Mode d'affichage"
            .value="${this._config.display_mode || 'percentage'}"
            @change="${this._valueChanged}"
            .configValue=${'display_mode'}
          >
            <mwc-list-item value="percentage">Pourcentage</mwc-list-item>
            <mwc-list-item value="value">Valeur</mwc-list-item>
          </ha-select>
        </div>

        <div class="row">
          <ha-textfield
            label="Décimales"
            type="number"
            min="0"
            max="5"
            .value="${this._config.decimals || 0}"
            @change="${this._valueChanged}"
            .configValue=${'decimals'}
          ></ha-textfield>
        </div>

        <div class="row">
          <ha-textfield
            label="Unité"
            .value="${this._config.unit || ''}"
            @change="${this._valueChanged}"
            .configValue=${'unit'}
          ></ha-textfield>
        </div>

        <div class="entities">
          ${(this._config.entities || []).map((entity, index) => `
            <div class="entity-row">
              <ha-entity-picker
                .hass="${this._hass}"
                .value="${entity.entity || ''}"
                .index="${index}"
                @value-changed="${this._entityChanged}"
                allow-custom-entity
              ></ha-entity-picker>
              <ha-textfield
                .value="${entity.name || ''}"
                .index="${index}"
                @change="${this._nameChanged}"
                label="Nom"
              ></ha-textfield>
              <ha-textfield
                .value="${entity.color || ''}"
                .index="${index}"
                @change="${this._colorChanged}"
                label="Couleur"
              ></ha-textfield>
              <ha-icon-button
                .index="${index}"
                @click="${this._removeEntity}"
              >
                <ha-icon icon="mdi:delete"></ha-icon>
              </ha-icon-button>
            </div>
          `).join('')}
        </div>
        
        <div class="row">
          <mwc-button @click="${this._addEntity}">
            Ajouter une entité
          </mwc-button>
        </div>
      </div>
    `;

    // Important: update all entity pickers with hass after render
    this.shadowRoot.querySelectorAll('ha-entity-picker').forEach(picker => {
      picker.hass = this._hass;
    });
  }

  _valueChanged(ev) {
    if (!this._config || !this.shadowRoot) return;

    const target = ev.target;
    const value = target.type === 'number' ? Number(target.value) : target.value;
    const configValue = target.configValue;

    if (configValue) {
      this._config = {
        ...this._config,
        [configValue]: value
      };
      this._fireChanged();
    }
  }

  _entityChanged(ev) {
    if (!ev.target.index) return;
    const index = parseInt(ev.target.index);
    const entities = [...(this._config.entities || [])];
    
    entities[index] = {
      ...entities[index],
      entity: ev.detail.value
    };
    
    this._config = {
      ...this._config,
      entities
    };
    
    this._fireChanged();
  }

  _nameChanged(ev) {
    if (!ev.target.index) return;
    const index = parseInt(ev.target.index);
    const entities = [...(this._config.entities || [])];
    
    entities[index] = {
      ...entities[index],
      name: ev.target.value
    };
    
    this._config = {
      ...this._config,
      entities
    };
    
    this._fireChanged();
  }

  _colorChanged(ev) {
    if (!ev.target.index) return;
    const index = parseInt(ev.target.index);
    const entities = [...(this._config.entities || [])];
    
    entities[index] = {
      ...entities[index],
      color: ev.target.value
    };
    
    this._config = {
      ...this._config,
      entities
    };
    
    this._fireChanged();
  }

  _addEntity() {
    const entities = [...(this._config.entities || [])];
    entities.push({
      entity: '',
      name: '',
      color: ''
    });
    
    this._config = {
      ...this._config,
      entities
    };
    
    this._fireChanged();
  }

  _removeEntity(ev) {
    const index = parseInt(ev.currentTarget.index);
    const entities = [...(this._config.entities || [])];
    entities.splice(index, 1);
    
    this._config = {
      ...this._config,
      entities
    };
    
    this._fireChanged();
  }

  _fireChanged() {
    const event = new CustomEvent('config-changed', {
      detail: { config: this._config },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }
}

customElements.define('bar-proportion-
