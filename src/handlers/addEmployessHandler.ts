import { Context } from "openapi-backend";
import { IRdfGraphDB } from "../persistence/IRdfGraphDB";
import { GraphPersistenceFactory } from "../persistence/GraphPersistenceFactory";
import { Response, Request } from "express";
import { UploadedFile } from "express-fileupload";
import { loadN3DataSetfromFile } from "../utils/loadN3DataSet";
import { DataIngestionStreamsFactory } from "../dataingestors/DataIngestionStreamsFactory";
import { StreamDataIngestorType } from "../dataingestors/StreamDataIngestorType";

const graphDB: IRdfGraphDB =  GraphPersistenceFactory.getGraphDB();

const addEmployeesHandler =  async (context: Context, request: Request, response: Response) => {
    if (!request.files) {
        response.status(400).send('No files were uploaded.');
        return;
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

            try { 
                await file.mv(filePath);
                console.log(uploadedFiles.name);

                // persistEmployeeDtoFileData(graphDB, filePath);
                const shapes = await loadN3DataSetfromFile('rdf/ontology/bank-organization.ttl');
    
                // create a new stream status object
                const dataIngestionStreamStatus = DataIngestionStreamsFactory.createStreamStatus();
    
                const streamDataIngestor: StreamDataIngestorType = DataIngestionStreamsFactory.getSreamDataIngestor(filePath);
                streamDataIngestor(filePath, shapes, dataIngestionStreamStatus);
                response.status(202).json({'Operation-Location': `${dataIngestionStreamStatus.getOperationLocation()}`});
                return;
            }
            catch (error) {
                console.log(error);
                response.status(500).json(error);
                return;
            }
        }
   }
};

export { addEmployeesHandler }