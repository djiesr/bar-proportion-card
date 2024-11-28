export function formatDisplay(value, total, config) {
  if (config.display_mode === 'percentage') {
    return `${(value / total * 100).toFixed(config.decimals)}%`;
  } else {
    return `${value.toFixed(config.decimals)}${config.unit}`;
  }
}

export function processEntityData(entity, hass) {
  const state = hass.states[entity.entity];
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
}
