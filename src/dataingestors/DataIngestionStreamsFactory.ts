import { StreamDataIngestorType } from './StreamDataIngestorType';
import { jsonEmployeeDTOFileToEmployeeStream } from './jsonEmployeeDTOFileToEmployeeStream';
import { csvEmployeeDTOFileToEmployeeStream } from './csvEmployeeDtoFileToEmployeeStream';
import { DataIngestionStreamStatus } from './DataIngestionStreamStatus';



class DataIngestionStreamsFactory {
    private static instance: DataIngestionStreamsFactory;
    private streams: Map<string, DataIngestionStreamStatus> = new Map<string, DataIngestionStreamStatus>();

    public static getInstance(): DataIngestionStreamsFactory {
        if (!DataIngestionStreamsFactory.instance) {
            DataIngestionStreamsFactory.instance = new DataIngestionStreamsFactory();
        }
        return DataIngestionStreamsFactory.instance;
    }

    public getFileExtension(filePath: string) : string {
        return filePath.substring(filePath.lastIndexOf(".") + 1);
    }

    public createStreamStatus(filePath: string): DataIngestionStreamStatus {
        const streamStatus = new DataIngestionStreamStatus(filePath);
        this.streams.set(streamStatus.requestId, streamStatus);
        return streamStatus;
    }

    public getStreamStatus(requestId: string): DataIngestionStreamStatus | undefined {
        return this.streams.get(requestId);
    }

    public getStreamStatuses(): DataIngestionStreamStatus[] {
        return Array.from(this.streams.values());
    }

    public getSreamDataIngestor(filePath: string): StreamDataIngestorType {
        switch(this.getFileExtension(filePath)) {
            case 'csv':
                return csvEmployeeDTOFileToEmployeeStream;
            case 'json':
                return jsonEmployeeDTOFileToEmployeeStream;
            case 'xlsx':
            case 'xslb':
            default:
                throw new Error(`Unsupported file type: ${DataIngestionStreamsFactory.getInstance().getFileExtension(filePath)}`);
        }
    }
}

export { DataIngestionStreamsFactory, DataIngestionStreamStatus }
