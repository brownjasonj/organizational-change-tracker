import { Writable } from "stream";
import { DataIngestionStreamStatus } from "../DataIngestionStreamsFactory";


class StreamDataIngestionStatusUpdater extends Writable {
    private ingestionStatus: DataIngestionStreamStatus;

    constructor(ingestionStatus: DataIngestionStreamStatus) {
        super({ objectMode: true });
        this.ingestionStatus = ingestionStatus;
    }

    _write(data: string, encoding: string, callback: Function) {
        console.log(`>>> Persisting the following: ${data}`);
        this.ingestionStatus.incrementEntriesProcessed()
        callback();
    }

    _final(callback: (error?: Error | null | undefined) => void): void {
        this.ingestionStatus.markAsCompleted();
        callback();
    }
}

export { StreamDataIngestionStatusUpdater }