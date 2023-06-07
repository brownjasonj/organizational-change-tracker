import { PassThrough, Writable } from "stream";
import { StreamThrottle } from "./StreamThrottle";
import { Logger } from "pino";
import { IOrganizationRdfQuery } from "../../rdf/IOrganizationRdfQuery";


class StreamRdfTurtlePersistToGraphStore extends PassThrough {
    private MAX_RETRIES = 5;
    private TIME_OUT_MS = 20;
    private msgCount = 0;
    private organizationRdfQuery: IOrganizationRdfQuery;
    private msgsQueued = 1;
    private streamThrottle: StreamThrottle;
    private logger: Logger;
    private failedDataIngestionLogger: Logger
    
    constructor(streamThrottle: StreamThrottle, organizationRdfQuery: IOrganizationRdfQuery, logger: Logger, failedDataIngestionLogger: Logger) {
        super({ objectMode: true });
        this.organizationRdfQuery = organizationRdfQuery;
        this.streamThrottle = streamThrottle;
        this.logger = logger;
        this.failedDataIngestionLogger = failedDataIngestionLogger;
    }

    trywrite(data: string, msg: number, retries: number, next: Function) {
        this.organizationRdfQuery.saveTurtle(data)
        .then((res) => {
            this.logger.info(`Message ${msg} persisted`);
            this.logger.info(res);
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
                // the write failed too many times, so we give up
                this.logger.error(`Error: ${err.message}.  Giving up processing after ${this.MAX_RETRIES} retries}`);
                // save the message to a file for later processing
                this.msgsQueued--;
                this.streamThrottle.updateTimeout(this.TIME_OUT_MS * this.msgsQueued);
                this.failedDataIngestionLogger.error(`${data}`);
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