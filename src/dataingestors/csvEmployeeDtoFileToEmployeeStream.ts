import fs from "fs";
import csv from "csv-parser";
import DatasetExt from "rdf-ext/lib/Dataset";
import { DataIngestionStreamStatus } from "./DataIngestionStreamsFactory";
import { StreamThrottle } from "./streamstages/StreamThrottle";
import { ConfigurationManager } from "../ConfigurationManager";
import { StreamTransformEmployeeDtoToEmployee } from "./streamstages/StreamTransformEmployeeDtoToEmployee";
import { StreamTransformEmployeeToRdf } from "./streamstages/StreamTransformEmployeeToRdf";
import { StreamRdfTurtlePersistToGraphStore } from "../persistence/StreamRdfTurtlePersistToGraphStore";
import { GraphPersistenceFactory } from "../persistence/GraphPersistenceFactory";
import { StreamDataIngestionStatusUpdater } from "./streamstages/StreamDataIngestionStatusUpdater";
import { pipeline } from 'stream';
import { consoleLogger } from "../logging/consoleLogger";
import { Logger } from "pino";

const csvEmployeeDTOFileToEmployeeStream = (filePath: string, organizationSchema: DatasetExt, dataIngestionStatus: DataIngestionStreamStatus, logger: Logger) => {
    const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
    const streamThrottle = new StreamThrottle(ConfigurationManager.getInstance().getApplicationConfiguration().getFrontEndConfiguration().getStreamTrottleTimeoutMs(), logger);
    const csvParser = csv();

    consoleLogger.info("csvEmployeeDTOFileToEmployeeStream");
    pipeline(
        stream,
        csvParser,
        streamThrottle,
        new StreamTransformEmployeeDtoToEmployee(logger),
        new StreamTransformEmployeeToRdf(logger),
//         new StreamRdfBankOrgValidation(organizationSchema),
        new StreamRdfTurtlePersistToGraphStore(streamThrottle, GraphPersistenceFactory.getInstance().getGraphDB(), logger),
        new StreamDataIngestionStatusUpdater(dataIngestionStatus, logger),
        (err: any) => consoleLogger.error('end', err)
    );
}

export { csvEmployeeDTOFileToEmployeeStream }