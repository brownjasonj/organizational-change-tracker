import * as fs from 'fs';
import JSONStream from 'jsonstream';
import { Employee } from '../models/eom/Employee';
import { StreamTransformEmployeeToRdf } from './StreamTransformEmployeeToRdf';
import { StreamTransformEmployeeDtoToEmployee } from './StreamTransformEmployeeDtoToEmployee';
import { StreamRdfTurtlePersistToGraphStore } from '../persistence/StreamRdfTurtlePersistToGraphStore';
import { StreamRdfBankOrgValidation } from './StreamRdfBankOrgValidation';
import DatasetExt from 'rdf-ext/lib/Dataset';


const employeeDtoFileToEmployeStream = (filePath: string, organizationSchema: DatasetExt) => {
    const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
    const parser = JSONStream.parse('*');
    stream
        .pipe(parser)
        .pipe(new StreamTransformEmployeeDtoToEmployee())
        .pipe(new StreamTransformEmployeeToRdf())
//        .pipe(new StreamRdfBankOrgValidation(organizationSchema))
        .pipe(new StreamRdfTurtlePersistToGraphStore());
}

export { employeeDtoFileToEmployeStream }