import * as fs from 'fs';
import JSONStream from 'jsonstream';
import { StreamRdfTurtlePersistToGraphStore } from './streamstages/StreamRdfTurtlePersistToGraphStore';
import { pipeline } from 'stream';
import { GraphPersistenceFactory } from '../persistence/GraphPersistenceFactory';
import { DataIngestionStreamStatus } from './DataIngestionStreamsFactory';
import { StreamDataIngestionStatusUpdater } from './streamstages/StreamDataIngestionStatusUpdater';
import { StreamThrottle } from './streamstages/StreamThrottle';
import { StreamTransformEmployeeDtoToEmployee } from './streamstages/StreamTransformEmployeeDtoToEmployee';
import { StreamTransformEmployeeToRdf } from './streamstages/StreamTransformEmployeeToRdf';
import { consoleLogger } from '../logging/consoleLogger';
import { Logger } from 'pino';
import { StreamRdfBankOrgValidation } from './streamstages/StreamRdfBankOrgValidation';
import { RdfSchemaValidation } from '../rdf/RdfSchemaValidation';
import { DataIngestionConfiguration } from '../models/eom/configuration/DataIngestionConfiguration';
import { StreamDataIngestionCleanup } from './streamstages/StreamDataIngestionCleanup';


function jsonEmployeeDTOFileToEmployeeStream(filePath: string, 
                rdfSchemaValidator: RdfSchemaValidation | undefined,
                dataIngestionStatus: DataIngestionStreamStatus,
                dataIngestionConfiguration: DataIngestionConfiguration,
                throttleTimeoutMs: number,
                logger: Logger,
                failedDataIngestionLogger: Logger): void {
    const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
    const parser = JSONStream.parse('*');
    const streamThrottle = new StreamThrottle(throttleTimeoutMs, logger);

     pipeline(
         stream,
         parser,
         streamThrottle,
         new StreamTransformEmployeeDtoToEmployee(logger),
         new StreamTransformEmployeeToRdf(logger),
         new StreamRdfBankOrgValidation(rdfSchemaValidator, logger),
         new StreamRdfTurtlePersistToGraphStore(streamThrottle, GraphPersistenceFactory.getInstance().getGraphDB(), logger, failedDataIngestionLogger),
         new StreamDataIngestionStatusUpdater(dataIngestionStatus, logger),
         new StreamDataIngestionCleanup(dataIngestionConfiguration, dataIngestionStatus, logger),
//         (err) => {
//             if (err) {
//               console.error('Pipeline failed', err);
//             } else {
//               console.log('Pipeline succeeded');
//             }
//         }
        err => consoleLogger.error('end', err)
     );
}

export { jsonEmployeeDTOFileToEmployeeStream }