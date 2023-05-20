import { Context } from "openapi-backend";
import { Response, Request } from "express";
import { UploadedFile } from "express-fileupload";
import { DataIngestionStreamsFactory } from "../dataingestors/DataIngestionStreamsFactory";
import { StreamDataIngestorType } from "../dataingestors/StreamDataIngestorType";
import { ConfigurationManager } from "../ConfigurationManager";
import { createFailedDataIngestionLogger } from "../logging/createFailedDataIngestionLogger";
import { createDataIngestionLogger } from "../logging/createDataIngestionLogger";
import { RdfSchemaValidation } from "../rdf/RdfSchemaValidation";
import { RdfInputSourceToN3Parser } from "../rdf/RdfInputSourceToN3Parser";

const getResourceLocation = (requestId: string) =>  {
    const frontEndConfiguration = ConfigurationManager.getInstance().getApplicationConfiguration().getFrontEndConfiguration();
    const resourceLocation = `http://${frontEndConfiguration.getHostname()}:${frontEndConfiguration.getHttpConfiguration().getPort()}/operations/load/${requestId}`;
    return resourceLocation;
};

const addEmployeesHandler =  async (context: Context, request: Request, response: Response) => {
    const backEndConfiguration = ConfigurationManager.getInstance().getApplicationConfiguration().getBackEndConfiguration();
    const loggingConfiguration = ConfigurationManager.getInstance().getApplicationConfiguration().getLoggingConfiguration();

    const dataIngestionStreamStatus = DataIngestionStreamsFactory.createStreamStatus();
    const dataIngestionLogger = createDataIngestionLogger(loggingConfiguration, `${dataIngestionStreamStatus.getRequestId()}.json`);
    const failedDataIngestionLogger = createFailedDataIngestionLogger(loggingConfiguration, `${dataIngestionStreamStatus.getRequestId()}-failed.json`);
    const streamThrottleTimoutMs = ConfigurationManager.getInstance().getApplicationConfiguration().getFrontEndConfiguration().getStreamTrottleTimeoutMs();
    const rdfInputSourceToN3Parser = new RdfInputSourceToN3Parser(backEndConfiguration, dataIngestionLogger);
    const rdfValidateData = new RdfSchemaValidation(backEndConfiguration, ConfigurationManager.getInstance().getApplicationConfiguration().getDataIngestionConfiguration().getOntologyValidationSchemaPath(), dataIngestionLogger, rdfInputSourceToN3Parser);

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