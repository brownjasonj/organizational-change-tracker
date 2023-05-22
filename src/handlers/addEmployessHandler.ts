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
import { consoleLogger } from "../logging/consoleLogger";

const getResourceLocation = (requestId: string) =>  {
    const frontEndConfiguration = ConfigurationManager.getInstance().getApplicationConfiguration().getFrontEndConfiguration();
    const resourceLocation = `http://${frontEndConfiguration.getHostname()}:${frontEndConfiguration.getHttpConfiguration().getPort()}/operations/load/${requestId}`;
    return resourceLocation;
};

function processFile(file: UploadedFile): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const filePath: string = `${ConfigurationManager.getInstance().getApplicationConfiguration().getDataIngestionConfiguration().getTemporaryDirectory()}/${file.name}`;
        const dataIngestionStreamsFactory: DataIngestionStreamsFactory = DataIngestionStreamsFactory.getInstance();
        const dataIngestionStreamStatus = dataIngestionStreamsFactory.createStreamStatus(filePath);
        file.mv(filePath).then(() => {
            const backEndConfiguration = ConfigurationManager.getInstance().getApplicationConfiguration().getBackEndConfiguration();
            const loggingConfiguration = ConfigurationManager.getInstance().getApplicationConfiguration().getLoggingConfiguration();
            const dataIngestionConfiguration = ConfigurationManager.getInstance().getApplicationConfiguration().getDataIngestionConfiguration();
            const dataIngestionLogger = createDataIngestionLogger(loggingConfiguration, `${dataIngestionStreamStatus.getRequestId()}.json`);
            const failedDataIngestionLogger = createFailedDataIngestionLogger(loggingConfiguration, `${dataIngestionStreamStatus.getRequestId()}-failed.json`);
            const streamThrottleTimoutMs = ConfigurationManager.getInstance().getApplicationConfiguration().getFrontEndConfiguration().getStreamTrottleTimeoutMs();
            const rdfInputSourceToN3Parser = new RdfInputSourceToN3Parser(backEndConfiguration, dataIngestionLogger);
            var rdfValidateData = undefined;
            
            if (dataIngestionConfiguration.getOntologyValidation()) {
                rdfValidateData = new RdfSchemaValidation(backEndConfiguration, ConfigurationManager.getInstance().getApplicationConfiguration().getDataIngestionConfiguration().getOntologyValidationSchemaPath(), dataIngestionLogger, rdfInputSourceToN3Parser);
            }
    
            const filePath: string = `${ConfigurationManager.getInstance().getApplicationConfiguration().getDataIngestionConfiguration().getTemporaryDirectory()}/${file.name}`;
            
            dataIngestionLogger.info(file.name);
            
            const streamDataIngestor: StreamDataIngestorType = dataIngestionStreamsFactory.getSreamDataIngestor(filePath);
            streamDataIngestor(filePath, rdfValidateData, dataIngestionStreamStatus, dataIngestionConfiguration, streamThrottleTimoutMs, dataIngestionLogger, failedDataIngestionLogger);
            // response.status(202).json({'Operation-Location': `${getResourceLocation(dataIngestionStreamStatus.getRequestId())}`});
            resolve(dataIngestionStreamStatus.getRequestId());
        }).catch((err) => {
            reject(err);
        });
    });
}

const addEmployeesHandler =  async (context: Context, request: Request, response: Response) => {
    if (!request.files) {
        response.status(400).send('No files were uploaded.');
        consoleLogger.error('No files were uploaded.');
        return;
    }
    else {
        const uploadedFiles = request.files.file;
        if (uploadedFiles instanceof Array) {
            await uploadedFiles.forEach((uploadedFile) => {
                processFile(uploadedFile).then((requestId) => {
                    response.status(202).json({'Operation-Location': `${requestId}`});
                }).catch((error) => {
                    consoleLogger.error(error);
                    response.status(500).json(error);
                });
                consoleLogger.info(` Loading file: ${uploadedFile.name}`);
            });
        }
        else {
            const file: UploadedFile = uploadedFiles as UploadedFile;
            processFile(file).then((requestId) => {
                response.status(202).json({'Operation-Location': `${requestId}`});
            }).catch((error) => {
                consoleLogger.info(error);
                response.status(500).json(error);
            });
        }
   }
};

export { addEmployeesHandler }