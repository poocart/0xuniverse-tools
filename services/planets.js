const isEmpty = require('lodash/isEmpty');
const Storage = require('../services/storage');
const SmartContract = require('../services/smartContract');
const { parseContractAmount } = require('../utils');

// setup
const PlanetsContract = SmartContract('0x06a6a7af298129e3a2ab396c9c06f91d3c54aba8', '0xUniversePlanetsContract');
const planetsStorage = new Storage('planets', {
  planets: [],
  lastSyncedPlanetId: 0,
});

const syncPlanets = async () => {
  const planetsStorageInstance = await planetsStorage.instance();
  const planets = planetsStorageInstance.get('planets');

  const lastSyncedPlanetId = planetsStorageInstance.get('lastSyncedPlanetId').value();

  const totalPlanets = parseContractAmount(await PlanetsContract.totalSupply());

  if (lastSyncedPlanetId === totalPlanets) return;

  for (let i=lastSyncedPlanetId+1; i<totalPlanets; i++) {
    // extra check if planet is in storage even though we're syncing sequentially
    const existingPlanet = planets.find({ id: i }).value();
    if (!isEmpty(existingPlanet)) continue;

    const rawPlanet = await PlanetsContract.getPlanet(i);
    const newPlanet = {
      id: i,
      sector: {
        x: parseContractAmount(rawPlanet.sectorX),
        y: parseContractAmount(rawPlanet.sectorY),
      },
      resourcesPerDay: {},
      rarity: parseContractAmount(rawPlanet.rarity),
      discoveredAt: parseContractAmount(rawPlanet.discovered),
    };
    planets.push(newPlanet).write();

    console.log(`Added planet ${i} of ${totalPlanets}`)
  }
};

module.exports = {
  syncPlanets,
};
