import { Context } from "openapi-backend";
import { IRdfGraphDB } from "../persistence/IRdfGraphDB";
import { GraphPersistenceFactory } from "../persistence/GraphPersistenceFactory";
import { Response, Request } from "express";
import { UploadedFile } from "express-fileupload";
import { loadN3DataSetfromFile } from "../utils/loadN3DataSet";
import { DataIngestionStreamsFactory } from "../dataingestors/DataIngestionStreamsFactory";
import { StreamDataIngestorType } from "../dataingestors/StreamDataIngestorType";
import { ConfigurationManager } from "../ConfigurationManager";
import { FrontEndHttpConfiguration } from "../models/eom/configuration/FrontEndConfiguration";
import { createDataIngestionLogger } from "../logging/dataIngestionLogger";

const getResourceLocation = (requestId: string) =>  {
    const frontEndConfiguration = ConfigurationManager.getInstance().getApplicationConfiguration().getFrontEndConfiguration();
    const resourceLocation = `http://${frontEndConfiguration.getHostname()}:${frontEndConfiguration.getHttpConfiguration().getPort()}/operations/load/${requestId}`;
    return resourceLocation;
};

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
                const dataIngestionLogger = createDataIngestionLogger(ConfigurationManager.getInstance().getApplicationConfiguration().getLoggingConfiguration(), `${dataIngestionStreamStatus.getRequestId()}.json`);
    
                const streamDataIngestor: StreamDataIngestorType = DataIngestionStreamsFactory.getSreamDataIngestor(filePath);
                streamDataIngestor(filePath, shapes, dataIngestionStreamStatus, dataIngestionLogger);
                response.status(202).json({'Operation-Location': `${getResourceLocation(dataIngestionStreamStatus.getRequestId())}`});
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