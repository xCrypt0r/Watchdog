import 'dotenv/config';
import 'module-alias/register';

import Watchdog from './Watchdog';

let watchdog = new Watchdog();

watchdog.run();
