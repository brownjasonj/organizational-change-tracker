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
    public filePath: string;

    constructor(filePath: string) {
        this.requestId = uuidv4().toString();
        this.createdDateTime = new Date();
        this.completedDateTime = null;
        this.entriesProcessed = 0;
        this.status = StreamStatus.processing;
        this.error = null;
        this.filePath = filePath;
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

    public getRequestId(): string {
        return this.requestId;
    }

    public getFilePath(): string {
        return this.filePath;
    }
}

export { DataIngestionStreamStatus, StreamStatus }