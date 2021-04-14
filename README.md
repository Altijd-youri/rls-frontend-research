# RailLinkSystems Frontend

Dit is de officiële frontend applicatie van Raillinksystems.

Om de applicatie lokaal te runnen dien je het volgende commando uit te voeren:
```sh
$ npm start
```

## Ontwikkelomgeving opzetten
### 1. Environment
Maak een kopie van `.env.production`, noem dit bestand `.env.local` of `.env.production.local`. 
Zet in dit bestand de juiste configuraties voor de lokale omgeving, zoals hieronder is weergegeven:
```
REACT_APP_ENDPOINT=http://localhost:5000
```
### 2. Backend
Clone ook het backend repository en start de backend, dit kan vooralsnog door de applicatie uit te voeren in Intellij IDE o.i.d.

# Git Strategie
## Feature branches
**Naam conventie:** `feature-{issuenummer}`.  
**CI:** Tests worden uitgevoerd voor elke `push` en `pull request`.  
**Strategie:** Pull Request / merge met `masterV2` zodra een feature af is.  

## Project branch
**Naam:** `masterV2`.  
**CI:** Tests + Build worden uitgevoerd voor elke `push` en `pull request`.  
**Strategie:** Pull Request / merge vanaf `feature` branch, niet direct pushen naar deze branch.  

## Master branch (acceptance - live test)
**Naam:** `master`.  
**CI/CD:** Tests, Build en Deploy worden uitgevoerd voor elke `push` en `pull request`.  
**Strategie:** Pull Request / merge vanaf `masterV2` branch, niet direct pushen naar deze branch.  


