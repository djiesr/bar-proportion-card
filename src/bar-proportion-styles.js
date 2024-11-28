const styles = `
  ha-card {
    background: var(--ha-card-background, var(--card-background-color));
    border-radius: var(--ha-card-border-radius, 12px);
    box-shadow: var(--ha-card-box-shadow, 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12));
    color: var(--primary-text-color);
    padding: 16px;
  }
  .header {
    color: var(--primary-text-color);
    font-size: var(--ha-card-header-font-size, 24px);
    line-height: 1.2;
    margin-bottom: 16px;
    font-weight: normal;
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
`;

export default styles;
