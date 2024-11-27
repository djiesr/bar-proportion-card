# Bar Proportion Card

Une carte personnalisée pour Home Assistant qui affiche des proportions sous forme de barre colorée segmentée.

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

### Options de la carte

| Option | Type | Par défaut | Description |
|--------|------|------------|-------------|
| type | string | **Requis** | `custom:bar-proportion-card` |
| title | string | `null` | Titre de la carte |
| display_mode | string | `percentage` | Mode d'affichage des valeurs : `percentage` ou `value` |
| unit | string | `''` | Unité à afficher après la valeur (en mode `value`) |
| decimals | number | `0` | Nombre de décimales à afficher |
| entities | array | **Requis** | Liste des entités à afficher |

### Options des entités

| Option | Type | Par défaut | Description |
|--------|------|------------|-------------|
| entity | string | **Requis** | ID de l'entité Home Assistant |
| name | string | `null` | Nom à afficher (utilise le friendly_name de l'entité si non spécifié) |
| color | string | `#1a4bff` | Couleur de la section (code hexadécimal, rgb, rgba, ou nom de couleur CSS) |

## Exemples

### Phases de sommeil avec pourcentages
```yaml
type: 'custom:bar-proportion-card'
title: 'Phases de sommeil'
display_mode: 'percentage'
decimals: 1
entities:
  - entity: sensor.deep_sleep
    name: 'Sommeil profond'
    color: '#1a4bff'
  - entity: sensor.light_sleep
    name: 'Sommeil léger'
    color: '#63a4ff'
  - entity: sensor.rem_sleep
    name: 'Sommeil REM'
    color: '#3978ff'
  - entity: sensor.awake
    name: 'Éveil'
    color: '#ff0000'
```

### Phases de sommeil avec minutes
```yaml
type: 'custom:bar-proportion-card'
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
  - entity: sensor.rem_sleep
    name: 'Sommeil REM'
    color: '#3978ff'
  - entity: sensor.awake
    name: 'Éveil'
    color: '#ff0000'
```

### Consommation électrique
```yaml
type: 'custom:bar-proportion-card'
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
  - entity: sensor.bedroom_consumption
    name: 'Chambre'
    color: '#0000ff'
```

## Personnalisation

### Couleurs
Vous pouvez utiliser n'importe quelle couleur CSS valide :
- Code hexadécimal : `#ff0000`
- RGB : `rgb(255, 0, 0)`
- RGBA : `rgba(255, 0, 0, 0.5)`
- Nom de couleur : `red`, `blue`, etc.

### Affichage
- Mode pourcentage : affiche les proportions en pourcentage
- Mode valeur : affiche les valeurs brutes avec l'unité spécifiée
- Le nombre de décimales est configurable pour les deux modes

## Support

Pour signaler un problème ou suggérer une amélioration, veuil
