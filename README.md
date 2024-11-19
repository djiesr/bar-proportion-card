# Bar Proportion Card

Une carte personnalisée pour Home Assistant qui affiche des proportions dans une barre.

## Installation

### HACS (recommandé)
1. Ouvrir HACS
2. Cliquer sur Frontend
3. Cliquer sur les 3 points en haut à droite
4. Sélectionner "Custom repositories"
5. Ajouter l'URL de ce repo
6. Sélectionner "Lovelace" comme catégorie

### Manuel
1. Télécharger `bar-proportion-card.js`
2. Copier dans `www/community/bar-proportion-card/`
3. Ajouter la ressource dans Lovelace

## Configuration

```yaml
type: custom:bar-proportion-card
title: Sleep Phases
entities:
  - entity: sensor.deep_sleep
    name: Deep Sleep
    color: bg-blue-700
