import * as fs from 'fs';
import { Writable } from "stream"
import { DataIngestionConfiguration } from "../../models/eom/configuration/DataIngestionConfiguration";
import { DataIngestionStreamStatus } from "../DataIngestionStreamStatus";
import { Logger } from "pino";


class StreamDataIngestionCleanup extends Writable {
    private dataIngestionConfiguration: DataIngestionConfiguration;
    private ingestionStatus: DataIngestionStreamStatus;
    private logger: Logger;

    constructor(dataIngestionConfiguration: DataIngestionConfiguration, ingestionStatus: DataIngestionStreamStatus, logger: Logger) {
        super({ objectMode: true });
        this.dataIngestionConfiguration = dataIngestionConfiguration;
        this.ingestionStatus = ingestionStatus;
        this.logger = logger;
    }

    _write(data: string, encoding: string, callback: Function) {
        callback();
    }
    
    _final(callback: (error?: Error | null | undefined) => void): void {
        if (this.dataIngestionConfiguration.getDeleteTemporaryFiles()) {
            const filePath = this.ingestionStatus.getFilePath();
            this.logger.info(`Deleting temporary file: ${filePath}`);
            fs.rmSync(filePath);
        }
        callback();
    }
}

export { StreamDataIngestionCleanup }