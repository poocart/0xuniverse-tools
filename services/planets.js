import isEmpty from 'lodash/isEmpty';
import Storage from 'services/storage';
import SmartContract from 'services/smartContract';
import { parseContractAmount } from 'utils';


// setup
const PlanetsContract = new SmartContract('0x06a6a7af298129e3a2ab396c9c06f91d3c54aba8', '../abi/0xUniversePlanetsContract.json');
const PlanetsStorage = new Storage('planets.json', {
  planets: [],
  lastSyncedPlanetId: 0,
});

export const syncPlanets = async () => {
  const planets = PlanetsStorage.get('planets');
  const lastSyncedPlanetId = PlanetsStorage.get('lastSyncedPlanetId').value();

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
    planets.insert(newPlanet).write();

    console.log(`Added planet ${i} of ${totalPlanets}`)
  }
};
