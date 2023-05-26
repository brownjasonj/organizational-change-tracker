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
import { v4 as uuidv4 } from 'uuid';

const getResourceLocation = (requestId: string) =>  {
    const frontEndConfiguration = ConfigurationManager.getInstance().getApplicationConfiguration().getFrontEndConfiguration();
    const resourceLocation = `http://${frontEndConfiguration.getHostname()}:${frontEndConfiguration.getHttpConfiguration().getPort()}/operations/load/${requestId}`;
    return resourceLocation;
};

function processFile(file: UploadedFile): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const applicationConfiguration = ConfigurationManager.getInstance().getApplicationConfiguration();
        const dataIngestionStreamsFactory: DataIngestionStreamsFactory = DataIngestionStreamsFactory.getInstance();
        const dataIngestionStreamStatus = dataIngestionStreamsFactory.createStreamStatus();

        // create the file name of the data that will be stored temporarily.  the name is a combination of the file passed into 
        // request and the the request id.  this is done to ensure that the file name is unique and that the file is not overwritten
        const temporaryFileName = `${dataIngestionStreamStatus.getRequestId()}-${file.name}`;
        const temporaryFilePath: string = `${applicationConfiguration.getDataIngestionConfiguration().getTemporaryDirectory()}/${temporaryFileName}`;

        file.mv(temporaryFilePath).then(() => {
            const backEndConfiguration = applicationConfiguration.getBackEndConfiguration();
            const loggingConfiguration = applicationConfiguration.getLoggingConfiguration();
            const dataIngestionConfiguration = applicationConfiguration.getDataIngestionConfiguration();
            const dataIngestionLogger = createDataIngestionLogger(loggingConfiguration, `${dataIngestionStreamStatus.getRequestId()}.json`);
            const failedDataIngestionLogger = createFailedDataIngestionLogger(loggingConfiguration, `${dataIngestionStreamStatus.getRequestId()}-failed.json`);
            const streamThrottleTimoutMs = applicationConfiguration.getFrontEndConfiguration().getStreamTrottleTimeoutMs();
            const rdfInputSourceToN3Parser = new RdfInputSourceToN3Parser(backEndConfiguration, dataIngestionLogger);
            var rdfValidateData = undefined;
            
            if (dataIngestionConfiguration.getOntologyValidation()) {
                rdfValidateData = new RdfSchemaValidation(backEndConfiguration, applicationConfiguration.getDataIngestionConfiguration().getOntologyValidationSchemaPath(), dataIngestionLogger, rdfInputSourceToN3Parser);
            }
    
            dataIngestionLogger.info(file.name);
            dataIngestionLogger.info(temporaryFilePath);
            
            const streamDataIngestor: StreamDataIngestorType = dataIngestionStreamsFactory.getSreamDataIngestor(temporaryFilePath);
            streamDataIngestor(temporaryFilePath, rdfValidateData, dataIngestionStreamStatus, dataIngestionConfiguration, streamThrottleTimoutMs, dataIngestionLogger, failedDataIngestionLogger);
            resolve(dataIngestionStreamStatus.getRequestId());
        }).catch((err) => {
            reject(err);
        });
    });
}

const uploadEmployeesByFileHandler =  async (context: Context, request: Request, response: Response) => {
    if (!request.files) {
        response.status(400).send('No files were uploaded.');
        consoleLogger.error('No files were uploaded.');
        return;
    }
    else {
        const uploadedFiles = request.files.file;
        if (uploadedFiles instanceof Array) {
            var requests: object[] = [];
            await uploadedFiles.forEach((uploadedFile) => {
                processFile(uploadedFile).then((requestId) => {
                    requests.push({'Operation-Location': `${getResourceLocation(requestId)}`});
//                    response.status(202).json({'Operation-Location': `${getResourceLocation(requestId)}`});
//                    response.status(202).json({'Operation-Location': `${requestId}`});
                }).catch((error) => {
                    consoleLogger.error(error);
                    response.status(500).json(error);
                });
                consoleLogger.info(` Loading file: ${uploadedFile.name}`);
            });
            response.status(202).json(requests);
        }
        else {
            const file: UploadedFile = uploadedFiles as UploadedFile;
            processFile(file).then((requestId) => {
                response.status(202).json({'Operation-Location': `${getResourceLocation(requestId)}`});
//                response.status(202).json({'Operation-Location': `${requestId}`});
            }).catch((error) => {
                consoleLogger.info(error);
                response.status(500).json(error);
            });
        }
   }
};

export { uploadEmployeesByFileHandler }