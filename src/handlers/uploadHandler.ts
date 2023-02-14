import * as fs from 'fs';
import { Response, Request} from "express"
import { UploadedFile } from "express-fileupload";
import { Context } from "openapi-backend"
import { IRdfGraphDB } from '../interfaces/IRdfGraphDB';
import { employeeDtoFileToEmployeStream } from '../dataingestors/employeeDtoFileToEmployeeStream';
import { GraphPersistenceFactory } from '../persistence/GraphPersistenceFactory';
import { loadN3DataSetfromFile } from '../utils/loadN3DataSet';


const graphDB: IRdfGraphDB =  GraphPersistenceFactory.getGraphDB();

const uploadHandler = async (context: Context, request: Request, response: Response) => {
    if (!request.files) {
        return response.status(400).send('No files were uploaded.');
    }
    else {
        const uploadedFiles = request.files.file;
        if (uploadedFiles instanceof Array) {
            uploadedFiles.forEach((uploadedFile) => {
                console.log(uploadedFile.name);
            });
        }
        else {
            const file: UploadedFile = uploadedFiles as UploadedFile;
            const filePath: string = `./tmp/${file.name}`;

            await file.mv(filePath, function(err) {
                return response.json(err);
            });

            console.log(uploadedFiles.name);

            // persistEmployeeDtoFileData(graphDB, filePath);
            const shapes = await loadN3DataSetfromFile('rdf/ontology/bank-organization.ttl');

            employeeDtoFileToEmployeStream(filePath, shapes);
        }
        response.json({ message: "done" });
    }
}


export { uploadHandler }
