import { DataIngestionStreamStatus } from './DataIngestionStreamStatus';

class DataIngestionStreamStatuses {
    private streams: Map<string, DataIngestionStreamStatus> = new Map<string, DataIngestionStreamStatus>();

    public createStreamStatus(): DataIngestionStreamStatus {
        const streamStatus = new DataIngestionStreamStatus();
        this.streams.set(streamStatus.requestId, streamStatus);
        return streamStatus;
    }

    public getStreamStatus(requestId: string): DataIngestionStreamStatus | undefined {
        return this.streams.get(requestId);
    }

    public getStreamStatuses(): DataIngestionStreamStatus[] {
        return Array.from(this.streams.values());
    }
}

export { DataIngestionStreamStatuses }
