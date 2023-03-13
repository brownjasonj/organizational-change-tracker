import { Context } from "openapi-backend";
import { IRdfGraphDB } from "../persistence/IRdfGraphDB";
import { GraphPersistenceFactory } from "../persistence/GraphPersistenceFactory";
import { Response, Request } from "express";
import { Employee } from "../models/eom/Employee";
import { UploadedFile } from "express-fileupload";
import { loadN3DataSetfromFile } from "../utils/loadN3DataSet";
import { DataIngestionStreamsFactory } from "../dataingestors/DataIngestionStreamsFactory";
import { StreamDataIngestorType } from "../dataingestors/StreamDataIngestorType";

const graphDB: IRdfGraphDB =  GraphPersistenceFactory.getGraphDB();

const addEmployeesHandler =  async (context: Context, request: Request, response: Response) => {
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

            // create a new stream status object
            const dataIngestionStreamStatus = DataIngestionStreamsFactory.createStreamStatus();

            const streamDataIngestor: StreamDataIngestorType = DataIngestionStreamsFactory.getSreamDataIngestor(filePath);
            streamDataIngestor(filePath, shapes, dataIngestionStreamStatus);
            response.status(202).json({'Operation-Location': `${dataIngestionStreamStatus.getOperationLocation()}`});
        }
   }
};

export { addEmployeesHandler }