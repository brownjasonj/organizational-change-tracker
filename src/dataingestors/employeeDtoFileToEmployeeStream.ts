import * as fs from 'fs';
import JSONStream from 'jsonstream';
import { Employee } from '../models/eom/Employee';
import { StreamTransformEmployeeToRdf } from './StreamTransformEmployeeToRdf';
import { StreamTransformEmployeeDtoToEmployee } from './StreamTransformEmployeeDtoToEmployee';
import { StreamRdfTurtlePersistToGraphStore } from '../persistence/StreamRdfTurtlePersistToGraphStore';
import { StreamRdfBankOrgValidation } from './StreamRdfBankOrgValidation';
import DatasetExt from 'rdf-ext/lib/Dataset';
import { pipeline } from 'stream';
import { StreamThrottle } from './StreamThrottle';
import { GraphPersistenceFactory } from '../persistence/GraphPersistenceFactory';


const employeeDtoFileToEmployeStream = (filePath: string, organizationSchema: DatasetExt) => {
    const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
    const parser = JSONStream.parse('*');
    const streamThrottle = new StreamThrottle(100);

     pipeline(
         stream,
         parser,
         streamThrottle,
         new StreamTransformEmployeeDtoToEmployee(),
         new StreamTransformEmployeeToRdf(),
//         new StreamRdfBankOrgValidation(organizationSchema),
         new StreamRdfTurtlePersistToGraphStore(streamThrottle, GraphPersistenceFactory.getGraphDB()),
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

export { employeeDtoFileToEmployeStream }