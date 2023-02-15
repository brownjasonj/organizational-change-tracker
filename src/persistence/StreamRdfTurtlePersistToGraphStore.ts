import { Writable } from "stream";
import { IRdfGraphDB } from "../interfaces/IRdfGraphDB";
import { GraphPersistenceFactory } from "./GraphPersistenceFactory";


class StreamRdfTurtlePersistToGraphStore extends Writable {
    private MAX_RETRIES = 5;
    private TIME_OUT_MS = 1000;
    private msgCount = 0;
    private graphDB: IRdfGraphDB;
    constructor() {
        super({ objectMode: true });
        this.graphDB = GraphPersistenceFactory.getGraphDB();
    }

    private syncWait(ms: number) {
        const start = Date.now();
        let now = start;
        while (now - start < ms) {
            now = Date.now();
        }
    }

    trywrite(data: string, msg: number, retries: number, next: Function) {
        this.graphDB.turtleUpdate(data)
        .then((res) => {
            console.log(`Message ${msg} persisted`);
            console.log(res);
            next();
        })
        .catch((err) => {
            if (retries < this.MAX_RETRIES) {
                console.log(`Error: ${err.message}.  Trying Again ${msg}`);
                this.syncWait(this.TIME_OUT_MS);
                this.trywrite(data, msg, retries + 1, next);
            }
            else {
                console.log(`Error: ${err.message}.  Giving up processing after ${this.MAX_RETRIES} retries}`);
                next();
            }
        });
    }


    async _write(data: string, encoding: string, next: Function) {
        console.log(`>>> Persisting the following: ${this.msgCount}`);            
        this.trywrite(data, this.msgCount++, 0, next);
        next();
    }

}

export { StreamRdfTurtlePersistToGraphStore }