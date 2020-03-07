import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { syncPlanets } from 'services/planets';

syncPlanets().then(() => console.log('PLANETS SYNC FINISHED!'));
