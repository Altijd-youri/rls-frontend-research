# RailLinkSystems Frontend

Dit is de officiële frontend applicatie van Raillinksystems.

Om de applicatie lokaal te runnen dien je het volgende commando uit te voeren:
```sh
$ npm start
```

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


