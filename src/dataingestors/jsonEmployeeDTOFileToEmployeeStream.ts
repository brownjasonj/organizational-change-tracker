import * as fs from 'fs';
import JSONStream from 'jsonstream';
import { Employee } from '../models/eom/Employee';
import { StreamRdfTurtlePersistToGraphStore } from './streamstages/StreamRdfTurtlePersistToGraphStore';
import DatasetExt from 'rdf-ext/lib/Dataset';
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


const jsonEmployeeDTOFileToEmployeeStream = (filePath: string, organizationSchema: DatasetExt, dataIngestionStatus: DataIngestionStreamStatus, throttleTimeoutMs: number, logger: Logger, failedDataIngestionLogger: Logger) => {
    const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
    const parser = JSONStream.parse('*');
    const streamThrottle = new StreamThrottle(throttleTimeoutMs, logger);

     pipeline(
         stream,
         parser,
         streamThrottle,
         new StreamTransformEmployeeDtoToEmployee(logger),
         new StreamTransformEmployeeToRdf(logger),
         new StreamRdfBankOrgValidation(organizationSchema, logger),
         new StreamRdfTurtlePersistToGraphStore(streamThrottle, GraphPersistenceFactory.getInstance().getGraphDB(), logger, failedDataIngestionLogger),
         new StreamDataIngestionStatusUpdater(dataIngestionStatus, logger),
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