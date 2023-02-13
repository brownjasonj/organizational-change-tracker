import * as fs from 'fs';
import JSONStream from 'jsonstream';
import { Employee } from '../models/eom/Employee';
import { StreamTransformEmployeeToRdf } from './StreamTransformEmployeeToRdf';
import { StreamTransformEmployeeDtoToEmployee } from './StreamTransformEmployeeDtoToEmployee';
import { StreamRdfTurtlePersistToGraphStore } from '../persistence/StreamRdfTurtlePersistToGraphStore';


const employeeDtoFileToEmployeStream = (filePath: string) => {
    const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
    const parser = JSONStream.parse('*');
    stream
        .pipe(parser)
        .pipe(new StreamTransformEmployeeDtoToEmployee())
        .pipe(new StreamTransformEmployeeToRdf())
        .pipe(new StreamRdfTurtlePersistToGraphStore());
}

export { employeeDtoFileToEmployeStream }