import { v4 as uuidv4 } from 'uuid';

enum StreamStatus {
    processing = 'processing',
    complete = 'complete',
    error = 'error'
};

class DataIngestionStreamStatus {
    public requestId: string;
    public createdDateTime: Date;
    public completedDateTime: Date | null;
    public entriesProcessed: number;
    public status: StreamStatus;
    public error: string | null;
    private resourceLocation: string;

    constructor() {
        this.requestId = uuidv4().toString();
        this.createdDateTime = new Date();
        this.completedDateTime = null;
        this.entriesProcessed = 0;
        this.status = StreamStatus.processing;
        this.error = null;
        this.resourceLocation = `http://localhost:9000/operations/load/${this.requestId}`;
    }

    public updateStatus(status: StreamStatus, error: string | null) {
        this.status = status;
        this.error = error;
    }

    public incrementEntriesProcessed() {
        this.entriesProcessed++;
    }

    public markAsCompleted() {
        this.completedDateTime = new Date();
        this.status = StreamStatus.complete;
    }

    public markAsError(error: string) {
        this.completedDateTime = new Date();
        this.status = StreamStatus.error;
        this.error = error;
    }

    public getOperationLocation(): string {
        return this.resourceLocation;
    }
}

class DataIngestionStreamsFactory {
    static streams: Map<string, DataIngestionStreamStatus> = new Map<string, DataIngestionStreamStatus>();

    static createStreamStatus(): DataIngestionStreamStatus {
        const streamStatus = new DataIngestionStreamStatus();
        this.streams.set(streamStatus.requestId, streamStatus);
        return streamStatus;
    }

    static getStreamStatus(requestId: string): DataIngestionStreamStatus | undefined {
        return this.streams.get(requestId);
    }
}

export { DataIngestionStreamsFactory, DataIngestionStreamStatus, StreamStatus }
