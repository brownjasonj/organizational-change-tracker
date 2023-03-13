import * as fs from 'fs';
import JSONStream from 'jsonstream';
import { Employee } from '../models/eom/Employee';
import { StreamRdfTurtlePersistToGraphStore } from '../persistence/StreamRdfTurtlePersistToGraphStore';
import DatasetExt from 'rdf-ext/lib/Dataset';
import { pipeline } from 'stream';
import { GraphPersistenceFactory } from '../persistence/GraphPersistenceFactory';
import { DataIngestionStreamStatus } from './DataIngestionStreamsFactory';
import { StreamDataIngestionStatusUpdater } from './streamstages/StreamDataIngestionStatusUpdater';
import { StreamThrottle } from './streamstages/StreamThrottle';
import { StreamTransformEmployeeDtoToEmployee } from './streamstages/StreamTransformEmployeeDtoToEmployee';
import { StreamTransformEmployeeToRdf } from './streamstages/StreamTransformEmployeeToRdf';
import { ConfigurationManager } from '../ConfigurationManager';


const jsonEmployeeDTOFileToEmployeeStream = (filePath: string, organizationSchema: DatasetExt, dataIngestionStatus: DataIngestionStreamStatus) => {
    const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
    const parser = JSONStream.parse('*');
    const streamThrottle = new StreamThrottle(ConfigurationManager.getInstance().getConfiguration().getStreamTrottleTimeoutMs());

     pipeline(
         stream,
         parser,
         streamThrottle,
         new StreamTransformEmployeeDtoToEmployee(),
         new StreamTransformEmployeeToRdf(),
//         new StreamRdfBankOrgValidation(organizationSchema),
         new StreamRdfTurtlePersistToGraphStore(streamThrottle, GraphPersistenceFactory.getGraphDB()),
         new StreamDataIngestionStatusUpdater(dataIngestionStatus),
//         (err) => {
//             if (err) {
//               console.error('Pipeline failed', err);
//             } else {
//               console.log('Pipeline succeeded');
//             }
//         }
        err => console.log('end', err)
     );
}

export { jsonEmployeeDTOFileToEmployeeStream }