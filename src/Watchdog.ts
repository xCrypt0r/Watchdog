import { Worker as Slave } from 'worker_threads';

import { SLAVE_PATH } from '@constants';
import { targets } from '@data';
import type { TargetGalleries, SlaveInfo } from '@types';

export default class Watchdog {
    private targets = targets as TargetGalleries;

    public run() {
        for (let [id, { name, type }] of Object.entries(this.targets)) {
            this.operateSlave({ id, name, type });
        }
    }

    private operateSlave({ id, name, type }: SlaveInfo) {
        let slave = this.bringNewSlave({ id, name, type });

        slave.once('error', async (err: any) => {
            console.error(`Error in gallery ${id}:`, err);
            await slave.terminate();
            this.operateSlave({ id, name, type });
        });
    }

    private bringNewSlave({ id, name, type }: SlaveInfo) {
        let slave = new Slave(SLAVE_PATH, {
            workerData: { GALLERY_ID: id, GALLERY_NAME: name, GALLERY_TYPE: type }
        });

        return slave;
    }
}
