const isEmpty = require('lodash/isEmpty');
const Storage = require('../services/storage');
const SmartContract = require('../services/smartContract');
const { parseContractAmount } = require('../utils');


// setup
const planetsContract = new SmartContract(process.env.PLANETS_CONTRACT_ADDRESS, '0xUniversePlanetsContract');
const planetsStorage = new Storage('planets', {
  planets: [],
  lastSyncedPlanetId: 0,
});

const syncPlanets = async () => {
  const planetsStorageInstance = await planetsStorage.instance();
  const planets = planetsStorageInstance.get('planets');

  const lastSyncedPlanetId = planetsStorageInstance.get('lastSyncedPlanetId').value();

  const totalPlanets = parseContractAmount(await planetsContract.totalSupply());

  if (lastSyncedPlanetId === totalPlanets) return;

  for (let i = lastSyncedPlanetId + 1; i < totalPlanets; i++) {
    // extra check if planet is in storage even though we're syncing sequentially
    const existingPlanet = planets.find({ id: i }).value();
    if (isEmpty(existingPlanet)) {
      const rawPlanet = await planetsContract.getPlanet(i);

      let resources = [];
      if (!isEmpty(rawPlanet.resourcesId)
        && !isEmpty(rawPlanet.resourcesVelocity)) {
        resources = rawPlanet.resourcesId
          .map((resourceRawId, resourceIndex) => {
            const resourcesId = parseContractAmount(resourceRawId);
            const amountPerDay = parseContractAmount(rawPlanet.resourcesVelocity[resourceIndex]);
            return { id: resourcesId, amountPerDay };
          })
          .filter((resource) => resource.id !== 0 || resource.amountPerDay !== 0);
      }

      const newPlanet = {
        id: i,
        sector: {
          x: parseContractAmount(rawPlanet.sectorX),
          y: parseContractAmount(rawPlanet.sectorY),
        },
        resources,
        rarity: parseContractAmount(rawPlanet.rarity),
        discoveredAt: parseContractAmount(rawPlanet.discovered),
      };
      planets.push(newPlanet).write();
      planetsStorageInstance.set('lastSyncedPlanetId', i).write();

      console.log(`Added planet ${i} of ${totalPlanets}`);
    }
  }
};

module.exports = {
  syncPlanets,
};
