import { PassThrough, Writable } from "stream";
import { IRdfGraphDB } from "./IRdfGraphDB";
import { GraphPersistenceFactory } from "./GraphPersistenceFactory";
import { StreamThrottle } from "../dataingestors/streamstages/StreamThrottle";
import { Logger } from "pino";


class StreamRdfTurtlePersistToGraphStore extends PassThrough {
    private MAX_RETRIES = 5;
    private TIME_OUT_MS = 20;
    private msgCount = 0;
    private graphDB: IRdfGraphDB;
    private msgsQueued = 1;
    private streamThrottle: StreamThrottle;
    private logger: Logger;
    
    constructor(streamThrottle: StreamThrottle, graphDB: IRdfGraphDB, logger: Logger) {
        super({ objectMode: true });
        this.graphDB = graphDB;
        this.streamThrottle = streamThrottle;
        this.logger = logger;
    }

    trywrite(data: string, msg: number, retries: number, next: Function) {
        this.graphDB.turtleUpdate(data)
        .then((res) => {
            this.logger.info(`Message ${msg} persisted`);
            console.log(res);
            this.msgsQueued--;
            this.streamThrottle.updateTimeout(this.TIME_OUT_MS * this.msgsQueued);
            this.push(data)
            next();
        })
        .catch((err) => {
            if (retries < this.MAX_RETRIES) {
                this.logger.error(`Error: ${err.message}.  Trying Again ${msg} after ${this.TIME_OUT_MS * this.msgsQueued} ms`);
                setTimeout(() => {
                    this.trywrite(data, msg, retries + 1, next);
                }, 1000);   
            }
            else {
                this.logger.error(`Error: ${err.message}.  Giving up processing after ${this.MAX_RETRIES} retries}`);
                this.msgsQueued--;
                this.streamThrottle.updateTimeout(this.TIME_OUT_MS * this.msgsQueued);
                next();
            }
        });
    }


    _write(data: string, encoding: string, next: Function) {
        this.logger.info(`>>> Persisting the following: ${this.msgCount}`);
        this.msgsQueued++;
        this.streamThrottle.updateTimeout(this.TIME_OUT_MS * this.msgsQueued);
        setTimeout(() => {
            this.trywrite(data, this.msgCount++, 0, next);
        }, 0);
    }
}

export { StreamRdfTurtlePersistToGraphStore }