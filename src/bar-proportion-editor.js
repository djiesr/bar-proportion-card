class BarProportionCardEditor extends HTMLElement {
  static styles = `
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

  setConfig(config) {
    this._config = config;
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

  firstUpdated() {
    this._buildForm();
  }

  // ... (reste du code de l'éditeur)
}

customElements.define('bar-proportion-card-editor', BarProportionCardEditor);
