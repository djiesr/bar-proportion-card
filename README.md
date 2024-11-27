# Bar Proportion Card

Une carte personnalisée pour Home Assistant qui affiche des proportions dans une barre.

![Example](/main/image.png)

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
Vous pouvez configurer la carte de plusieurs façons :

Pour afficher des pourcentages (par défaut) :

'''yaml
title: 'Phases de sommeil'
display_mode: 'percentage'
decimals: 1  # Pour avoir une décimale
entities:
  - entity: sensor.deep_sleep
    name: 'Sommeil profond'
    color: '#1a4bff'
  - entity: sensor.light_sleep
    name: 'Sommeil léger'
    color: '#63a4ff'

Pour afficher les minutes :

'''yaml
title: 'Phases de sommeil'
display_mode: 'value'
unit: ' min'
entities:
  - entity: sensor.deep_sleep
    name: 'Sommeil profond'
    color: '#1a4bff'
  - entity: sensor.light_sleep
    name: 'Sommeil léger'
    color: '#63a4ff'

Pour d'autres types de valeurs (par exemple des kWh) :

'''yaml
title: 'Consommation électrique'
display_mode: 'value'
unit: ' kWh'
decimals: 2
entities:
  - entity: sensor.kitchen_consumption
    name: 'Cuisine'
    color: '#ff0000'
  - entity: sensor.living_room_consumption
    name: 'Salon'
    color: '#00ff00'
