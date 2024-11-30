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

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._initialized = false;
  }

  firstUpdated() {
    this._initialized = true;
    this._createForm();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._initialized) {
      this.firstUpdated();
    }
  }

  setConfig(config) {
    this._config = config;
    if (!this._initialized) {
      this.firstUpdated();
    }
  }

  _createForm() {
    if (!this._hass || !this._config) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'card-config';

    const style = document.createElement('style');
    style.textContent = BarProportionCardEditor.styles;
    wrapper.appendChild(style);

    // Titre
    const titleRow = this._createRow();
    const titleField = document.createElement('ha-textfield');
    titleField.label = "Titre";
    titleField.value = this._config.title || '';
    titleField.addEventListener('change', (ev) => this._valueChanged('title', ev.target.value));
    titleRow.appendChild(titleField);
    wrapper.appendChild(titleRow);

    // Mode d'affichage
    const displayRow = this._createRow();
    const displaySelect = document.createElement('ha-select');
    displaySelect.label = "Mode d'affichage";
    displaySelect.value = this._config.display_mode || 'percentage';
    const options = [
      ['percentage', 'Pourcentage'],
      ['value', 'Valeur']
    ];
    options.forEach(([value, label]) => {
      const item = document.createElement('mwc-list-item');
      item.value = value;
      item.innerText = label;
      displaySelect.appendChild(item);
    });
    displaySelect.addEventListener('selected', (ev) => this._valueChanged('display_mode', ev.target.value));
    displayRow.appendChild(displaySelect);
    wrapper.appendChild(displayRow);

    // Décimales
    const decimalsRow = this._createRow();
    const decimalsField = document.createElement('ha-textfield');
    decimalsField.label = "Décimales";
    decimalsField.type = "number";
    decimalsField.min = "0";
    decimalsField.max = "5";
    decimalsField.value = this._config.decimals || 0;
    decimalsField.addEventListener('change', (ev) => this._valueChanged('decimals', parseInt(ev.target.value)));
    decimalsRow.appendChild(decimalsField);
    wrapper.appendChild(decimalsRow);

    // Unité
    const unitRow = this._createRow();
    const unitField = document.createElement('ha-textfield');
    unitField.label = "Unité";
    unitField.value = this._config.unit || '';
    unitField.addEventListener('change', (ev) => this._valueChanged('unit', ev.target.value));
    unitRow.appendChild(unitField);
    wrapper.appendChild(unitRow);

    // Entités
    const entitiesContainer = document.createElement('div');
    entitiesContainer.className = 'entities';
    
    const addEntityBtn = document.createElement('mwc-button');
    addEntityBtn.innerHTML = 'Ajouter une entité';
    addEntityBtn.addEventListener('click', () => this._addEntity());

    this._createEntityRows(entitiesContainer);
    
    wrapper.appendChild(entitiesContainer);
    wrapper.appendChild(addEntityBtn);

    // Remplacer tout le contenu
    while (this.shadowRoot.firstChild) {
      this.shadowRoot.removeChild(this.shadowRoot.firstChild);
    }
    this.shadowRoot.appendChild(wrapper);
  }

  _createRow() {
    const row = document.createElement('div');
    row.className = 'row';
    return row;
  }

  _createEntityRows(container) {
    container.innerHTML = '';
    (this._config.entities || []).forEach((entity, index) => {
      const row = document.createElement('div');
      row.className = 'entity-row';

      // Entity Picker
      const entityPicker = document.createElement('ha-entity-picker');
      entityPicker.hass = this._hass;
      entityPicker.value = entity.entity;
      entityPicker.allowCustomEntity = true;
      entityPicker.index = index;
      entityPicker.addEventListener('value-changed', (ev) => {
        this._entityChanged(index, ev.detail.value);
      });

      // Name Field
      const nameField = document.createElement('ha-textfield');
      nameField.label = "Nom";
      nameField.value = entity.name || '';
      nameField.addEventListener('change', (ev) => {
        this._nameChanged(index, ev.target.value);
      });

      // Color Field
      const colorField = document.createElement('ha-textfield');
      colorField.label = "Couleur";
      colorField.value = entity.color || '';
      colorField.addEventListener('change', (ev) => {
        this._colorChanged(index, ev.target.value);
      });

      // Delete Button
      const deleteBtn = document.createElement('ha-icon-button');
      deleteBtn.innerHTML = '<ha-icon icon="mdi:delete"></ha-icon>';
      deleteBtn.addEventListener('click', () => {
        this._removeEntity(index);
      });

      row.appendChild(entityPicker);
      row.appendChild(nameField);
      row.appendChild(colorField);
      row.appendChild(deleteBtn);
      container.appendChild(row);
    });
  }

  _valueChanged(field, value) {
    if (!this._config) return;
    this._config = {
      ...this._config,
      [field]: value
    };
    this._fireChanged();
  }

  _entityChanged(index, value) {
    const entities = [...(this._config.entities || [])];
    entities[index] = { ...entities[index], entity: value };
    this._valueChanged('entities', entities);
  }

  _nameChanged(index, value) {
    const entities = [...(this._config.entities || [])];
    entities[index] = { ...entities[index], name: value };
    this._valueChanged('entities', entities);
  }

  _colorChanged(index, value) {
    const entities = [...(this._config.entities || [])];
    entities[index] = { ...entities[index], color: value };
    this._valueChanged('entities', entities);
  }

  _addEntity() {
    const entities = [...(this._config.entities || [])];
    entities.push({ entity: '', name: '', color: '' });
    this._valueChanged('entities', entities);
    this._createEntityRows(this.shadowRoot.querySelector('.entities'));
  }

  _removeEntity(index) {
    const entities = [...(this._config.entities || [])];
    entities.splice(index, 1);
    this._valueChanged('entities', entities);
    this._createEntityRows(this.shadowRoot.querySelector('.entities'));
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

customElements.define('bar-proportion-card-editor', BarProportionCardEditor);
