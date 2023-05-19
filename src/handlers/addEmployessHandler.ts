import { Context } from "openapi-backend";
import { Response, Request } from "express";
import { UploadedFile } from "express-fileupload";
import { loadN3DataSetfromFile } from "../utils/loadN3DataSet";
import { DataIngestionStreamsFactory } from "../dataingestors/DataIngestionStreamsFactory";
import { StreamDataIngestorType } from "../dataingestors/StreamDataIngestorType";
import { ConfigurationManager } from "../ConfigurationManager";
import { createFailedDataIngestionLogger } from "../logging/createFailedDataIngestionLogger";
import { createDataIngestionLogger } from "../logging/createDataIngestionLogger";
import { RdfSchemaValidation } from "../rdf/RdfSchemaValidation";

const getResourceLocation = (requestId: string) =>  {
    const frontEndConfiguration = ConfigurationManager.getInstance().getApplicationConfiguration().getFrontEndConfiguration();
    const resourceLocation = `http://${frontEndConfiguration.getHostname()}:${frontEndConfiguration.getHttpConfiguration().getPort()}/operations/load/${requestId}`;
    return resourceLocation;
};

const addEmployeesHandler =  async (context: Context, request: Request, response: Response) => {
    // create a new stream status object
    const dataIngestionStreamStatus = DataIngestionStreamsFactory.createStreamStatus();
    const dataIngestionLogger = createDataIngestionLogger(ConfigurationManager.getInstance().getApplicationConfiguration().getLoggingConfiguration(), `${dataIngestionStreamStatus.getRequestId()}.json`);
    const failedDataIngestionLogger = createFailedDataIngestionLogger(ConfigurationManager.getInstance().getApplicationConfiguration().getLoggingConfiguration(), `${dataIngestionStreamStatus.getRequestId()}-failed.json`);
    const streamThrottleTimoutMs = ConfigurationManager.getInstance().getApplicationConfiguration().getFrontEndConfiguration().getStreamTrottleTimeoutMs();
    const rdfValidateData = new RdfSchemaValidation(ConfigurationManager.getInstance().getApplicationConfiguration().getBackEndConfiguration(), ConfigurationManager.getInstance().getApplicationConfiguration().getDataIngestionConfiguration().getOntologyValidationSchemaPath(), dataIngestionLogger);

    if (!request.files) {
        response.status(400).send('No files were uploaded.');
        dataIngestionLogger.error('No files were uploaded.');
        return;
    }
    else {
        const uploadedFiles = request.files.file;
        if (uploadedFiles instanceof Array) {
            uploadedFiles.forEach((uploadedFile) => {
                dataIngestionLogger.info(` Loading file: ${uploadedFile.name}`);
            });
        }
        else {
            const file: UploadedFile = uploadedFiles as UploadedFile;
            const filePath: string = `${ConfigurationManager.getInstance().getApplicationConfiguration().getDataIngestionConfiguration().getTemporaryDirectory()}/${file.name}`;

            try { 
                await file.mv(filePath);
    

                dataIngestionLogger.info(uploadedFiles.name);

                const streamDataIngestor: StreamDataIngestorType = DataIngestionStreamsFactory.getSreamDataIngestor(filePath);
                streamDataIngestor(filePath, rdfValidateData, dataIngestionStreamStatus, streamThrottleTimoutMs, dataIngestionLogger, failedDataIngestionLogger);
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