import fs from "fs";
import csv from "csv-parser";
import DatasetExt from "rdf-ext/lib/Dataset";
import { DataIngestionStreamStatus } from "./DataIngestionStreamsFactory";
import { StreamThrottle } from "./streamstages/StreamThrottle";
import { StreamTransformEmployeeDtoToEmployee } from "./streamstages/StreamTransformEmployeeDtoToEmployee";
import { StreamTransformEmployeeToRdf } from "./streamstages/StreamTransformEmployeeToRdf";
import { StreamRdfTurtlePersistToGraphStore } from "./streamstages/StreamRdfTurtlePersistToGraphStore";
import { GraphPersistenceFactory } from "../persistence/GraphPersistenceFactory";
import { StreamDataIngestionStatusUpdater } from "./streamstages/StreamDataIngestionStatusUpdater";
import { pipeline } from 'stream';
import { consoleLogger } from "../logging/consoleLogger";
import { Logger } from "pino";
import { StreamRdfBankOrgValidation } from "./streamstages/StreamRdfBankOrgValidation";

const csvEmployeeDTOFileToEmployeeStream = (filePath: string, organizationSchema: DatasetExt, dataIngestionStatus: DataIngestionStreamStatus, throttleTimeoutMs: number, logger: Logger, failedDataIngestionLogger: Logger) => {
    const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
    const streamThrottle = new StreamThrottle(throttleTimeoutMs, logger);
    const csvParser = csv();

    consoleLogger.info("csvEmployeeDTOFileToEmployeeStream");
    
    pipeline(
        stream,
        csvParser,
        streamThrottle,
        new StreamTransformEmployeeDtoToEmployee(logger),
        new StreamTransformEmployeeToRdf(logger),
        new StreamRdfBankOrgValidation(organizationSchema, logger),
        new StreamRdfTurtlePersistToGraphStore(streamThrottle, GraphPersistenceFactory.getInstance().getGraphDB(), logger, failedDataIngestionLogger),
        new StreamDataIngestionStatusUpdater(dataIngestionStatus, logger),
        (err: any) => consoleLogger.error('end', err)
    );
}

export { csvEmployeeDTOFileToEmployeeStream }