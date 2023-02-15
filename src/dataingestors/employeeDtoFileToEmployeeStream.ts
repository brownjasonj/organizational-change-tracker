import * as fs from 'fs';
import JSONStream from 'jsonstream';
import { Employee } from '../models/eom/Employee';
import { StreamTransformEmployeeToRdf } from './StreamTransformEmployeeToRdf';
import { StreamTransformEmployeeDtoToEmployee } from './StreamTransformEmployeeDtoToEmployee';
import { StreamRdfTurtlePersistToGraphStore } from '../persistence/StreamRdfTurtlePersistToGraphStore';
import { StreamRdfBankOrgValidation } from './StreamRdfBankOrgValidation';
import DatasetExt from 'rdf-ext/lib/Dataset';
import { pipeline } from 'stream';


const employeeDtoFileToEmployeStream = (filePath: string, organizationSchema: DatasetExt) => {
    const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
    const parser = JSONStream.parse('*');

    pipeline(
        stream,
        parser,
        new StreamTransformEmployeeDtoToEmployee(),
        new StreamTransformEmployeeToRdf(),
//        new StreamRdfBankOrgValidation(organizationSchema),
        new StreamRdfTurtlePersistToGraphStore(),
        (err) => {
            if (err) {
              console.error('Pipeline failed', err);
            } else {
              console.log('Pipeline succeeded');
            }
        }
    );

//     stream
//         .pipe(parser)
//         .pipe(new StreamTransformEmployeeDtoToEmployee())
//         .pipe(new StreamTransformEmployeeToRdf())
// //        .pipe(new StreamRdfBankOrgValidation(organizationSchema))
//         .pipe(new StreamRdfTurtlePersistToGraphStore());
}

export { employeeDtoFileToEmployeStream }