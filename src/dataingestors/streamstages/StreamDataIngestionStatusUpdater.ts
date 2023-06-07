import { PassThrough, Writable } from "stream";
import { Logger } from "pino";
import { DataIngestionStreamStatus } from "../DataIngestionStreamStatus";


class StreamDataIngestionStatusUpdater extends PassThrough {
    private ingestionStatus: DataIngestionStreamStatus;
    private logger: Logger;

    constructor(ingestionStatus: DataIngestionStreamStatus, logger: Logger) {
        super({ objectMode: true });
        this.ingestionStatus = ingestionStatus;
        this.logger = logger;
    }

    _write(data: string, encoding: string, callback: Function) {
        this.logger.info(`>>> Persisting the following: ${data}`);
        this.ingestionStatus.incrementEntriesProcessed();
        callback();
    }

    _final(callback: (error?: Error | null | undefined) => void): void {
        this.ingestionStatus.markAsCompleted();
        callback();
    }
}

export { StreamDataIngestionStatusUpdater }