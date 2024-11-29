class BarProportionCardEditor extends HTMLElement {
  static get styles() {
    return `
      .form-container {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .row {
        padding: 8px 0;
        display: flex;
        flex-direction: column;
      }
      .entities {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .entity-row {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .entity-row ha-icon {
        cursor: pointer;
        color: var(--primary-text-color);
      }
      mwc-button {
        margin-top: 8px;
      }
      ha-textfield {
        width: 100%;
      }
    `;
  }

  constructor() {
    super();
    console.log('BarProportionCardEditor - Constructor called');
    this._config = {};
  }

  setConfig(config) {
    console.log('BarProportionCardEditor - setConfig called', config);
    this._config = config;
    this._buildForm();
  }

  get _title() {
    return this._config.title || '';
  }

  get _entities() {
    return this._config.entities || [];
  }

  get _display_mode() {
    return this._config.display_mode || 'percentage';
  }

  get _decimals() {
    return this._config.decimals || 0;
  }

  get _unit() {
    return this._config.unit || '';
  }

  _buildForm() {
    console.log('Building form with hass:', this._hass);
    if (this.shadowRoot) {
      this.shadowRoot.lastChild?.remove();
    }

    const helper = document.createElement('div');
    helper.innerHTML = `
      <style>${BarProportionCardEditor.styles}</style>
      <div class="form-container">
        <div class="row">
          <ha-textfield
            label="Titre"
            .value="${this._title}"
            @change="${this._valueChanged}"
            id="title"
          ></ha-textfield>
        </div>
        
        <div class="row">
          <ha-select
            label="Mode d'affichage"
            .value="${this._display_mode}"
            @selected="${this._displayModeChanged}"
            id="display_mode"
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
            .value="${this._decimals}"
            @change="${this._valueChanged}"
            id="decimals"
          ></ha-textfield>
        </div>

        <div class="row">
          <ha-textfield
            label="Unité"
            .value="${this._unit}"
            @change="${this._valueChanged}"
            id="unit"
          ></ha-textfield>
        </div>

        <div class="row">
          <label>Entités</label>
          <div class="entities" id="entities">
            ${this._entities.map((entity, index) => this._createEntityRow(entity, index)).join('')}
          </div>
          <mwc-button @click="${this._addEntity}">Ajouter une entité</mwc-button>
        </div>
      </div>
    `;

    const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
    root.appendChild(helper.children[0]);
    root.appendChild(helper.children[0]);
    this._initializeElements();
  }

  connectedCallback() {
    console.log('BarProportionCardEditor - Connected to DOM');
    if (!this.shadowRoot) {
      this._buildForm();
    }
  }

  // Le reste des méthodes reste identique
  _initializeElements() {
    this._entities.forEach((entity, index) => {
      const entitySelect = this.shadowRoot.querySelector(`#entity-${index}`);
      if (entitySelect) {
        entitySelect.addEventListener('value-changed', (ev) => {
          this._entityChanged(index, ev.detail.value);
        });
      }
    });
  }

  set hass(hass) {
    console.log('Setting hass in editor');
    this._hass = hass;
    // On reconstruit le formulaire uniquement si la config existe déjà
    if (this._config) {
      this._buildForm();
    }
  }
  
  _createEntityRow(entity, index) {
    return `
      ${index === 0 ? `
        <div class="entity-header" style="display: flex; gap: 8px; margin-bottom: 8px; color: var(--primary-text-color);">
          <div style="flex-grow: 1; min-width: 200px;">Entité</div>
          <div style="flex-grow: 1; min-width: 150px;">Nom personnalisé</div>
          <div style="min-width: 120px;">Couleur</div>
          <div style="width: 48px;"></div>
        </div>
      ` : ''}
      <div class="entity-row">
        <ha-entity-picker
          id="entity-${index}"
          .hass="${this._hass}"
          .value="${entity.entity}"
          .label="Sélectionner une entité"
          .includeDomains=${['sensor', 'input_number', 'number']}
          allow-custom-entity
          .localizeFunc=${this._hass?.localize}
          style="flex-grow: 1; min-width: 200px;"
        ></ha-entity-picker>
        <ha-textfield
          .value="${entity.name || ''}"
          .label="Nom affiché (optionnel)"
          id="name-${index}"
          @change="${(ev) => this._nameChanged(index, ev)}"
          style="flex-grow: 1; min-width: 150px;"
        ></ha-textfield>
        <ha-textfield
          .value="${entity.color || ''}"
          .label="Couleur (ex: #FF0000)"
          id="color-${index}"
          @change="${(ev) => this._colorChanged(index, ev)}"
          style="min-width: 120px;"
        ></ha-textfield>
        <ha-icon-button
          .path="mdi:delete"
          @click="${() => this._removeEntity(index)}"
          style="color: var(--primary-text-color);"
        ></ha-icon-button>
      </div>
    `;
  }

  _addEntity() {
    const entities = [...this._entities];
    entities.push({
      entity: '',
      name: '',
      color: ''
    });
    this._updateConfig({ entities });
  }

  _removeEntity(index) {
    const entities = [...this._entities];
    entities.splice(index, 1);
    this._updateConfig({ entities });
  }

  _entityChanged(index, value) {
    const entities = [...this._entities];
    entities[index] = { ...entities[index], entity: value };
    this._updateConfig({ entities });
  }

  _nameChanged(index, ev) {
    const entities = [...this._entities];
    entities[index] = { ...entities[index], name: ev.target.value };
    this._updateConfig({ entities });
  }

  _colorChanged(index, ev) {
    const entities = [...this._entities];
    entities[index] = { ...entities[index], color: ev.target.value };
    this._updateConfig({ entities });
  }

  _displayModeChanged(ev) {
    this._updateConfig({ display_mode: ev.target.value });
  }

  _valueChanged(ev) {
    const target = ev.target;
    this._updateConfig({ [target.id]: target.value });
  }

  _updateConfig(updates) {
    const newConfig = { ...this._config, ...updates };
    const event = new CustomEvent('config-changed', {
      detail: { config: newConfig }
    });
    this.dispatchEvent(event);
  }
}

customElements.define('bar-proportion-card-editor', BarProportionCardEditor);

console.log('bar-proportion-editor.js loaded and registered');
