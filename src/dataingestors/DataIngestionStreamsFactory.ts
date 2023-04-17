import { v4 as uuidv4 } from 'uuid';
import { StreamDataIngestorType } from './StreamDataIngestorType';
import { jsonEmployeeDTOFileToEmployeeStream } from './jsonEmployeeDTOFileToEmployeeStream';
import { csvEmployeeDTOFileToEmployeeStream } from './csvEmployeeDtoFileToEmployeeStream';
import { ConfigurationManager } from '../ConfigurationManager';

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

    constructor() {
        this.requestId = uuidv4().toString();
        this.createdDateTime = new Date();
        this.completedDateTime = null;
        this.entriesProcessed = 0;
        this.status = StreamStatus.processing;
        this.error = null;
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
}

class DataIngestionStreamsFactory {
    static streams: Map<string, DataIngestionStreamStatus> = new Map<string, DataIngestionStreamStatus>();

    static getFileExtension(filePath: string) : string {
        return filePath.substring(filePath.lastIndexOf(".") + 1);
    }

    static createStreamStatus(): DataIngestionStreamStatus {
        const streamStatus = new DataIngestionStreamStatus();
        this.streams.set(streamStatus.requestId, streamStatus);
        return streamStatus;
    }

    static getStreamStatus(requestId: string): DataIngestionStreamStatus | undefined {
        return this.streams.get(requestId);
    }

    static getSreamDataIngestor(filePath: string): StreamDataIngestorType {
        switch(DataIngestionStreamsFactory.getFileExtension(filePath)) {
            case 'csv':
                return csvEmployeeDTOFileToEmployeeStream;
            case 'json':
                return jsonEmployeeDTOFileToEmployeeStream;
            case 'xlsx':
            case 'xslb':
            default:
                throw new Error(`Unsupported file type: ${DataIngestionStreamsFactory.getFileExtension(filePath)}`);
        }
    }
}

export { DataIngestionStreamsFactory, DataIngestionStreamStatus, StreamStatus }
