import fs from "fs";
import csv from "csv-parser";
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
import { RdfSchemaValidation } from "../rdf/RdfSchemaValidation";
import { DataIngestionConfiguration } from "../models/eom/configuration/DataIngestionConfiguration";
import { StreamDataIngestionCleanup } from "./streamstages/StreamDataIngestionCleanup";

function csvEmployeeDTOFileToEmployeeStream(filePath: string, 
    rdfSchemaValidator: RdfSchemaValidation | undefined,
    dataIngestionStatus: DataIngestionStreamStatus,
    dataIngestionConfiguration: DataIngestionConfiguration,
    throttleTimeoutMs: number,
    logger: Logger,
    failedDataIngestionLogger: Logger): void {
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
        new StreamRdfBankOrgValidation(rdfSchemaValidator, logger),
        new StreamRdfTurtlePersistToGraphStore(streamThrottle, GraphPersistenceFactory.getInstance().getGraphDB(), logger, failedDataIngestionLogger),
        new StreamDataIngestionStatusUpdater(dataIngestionStatus, logger),
        new StreamDataIngestionCleanup(dataIngestionConfiguration, dataIngestionStatus, logger),
        (err: any) => consoleLogger.error('end', err)
    );
}

export { csvEmployeeDTOFileToEmployeeStream }