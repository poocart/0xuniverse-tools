const { syncPlanets } = require('./services/planets');

syncPlanets().then(() => console.log('PLANETS SYNC FINISHED!'));
