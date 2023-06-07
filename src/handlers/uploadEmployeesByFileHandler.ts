import { Context } from "openapi-backend";
import { Response, Request } from "express";
import { UploadedFile } from "express-fileupload";
import { ConfigurationManager } from "../ConfigurationManager";
import { consoleLogger } from "../logging/consoleLogger";
import { DataIngestionPipeline } from "../dataingestors/DataIngestionPipeline";

const getResourceLocation = (requestId: string) =>  {
    const frontEndConfiguration = ConfigurationManager.getInstance().getApplicationConfiguration().getFrontEndConfiguration();
    const resourceLocation = `http://${frontEndConfiguration.getHostname()}:${frontEndConfiguration.getHttpConfiguration().getPort()}/operations/upload/${requestId}/status`;
    return resourceLocation;
};

const uploadEmployeesByFileHandler = (dataIngestionPipeline: DataIngestionPipeline) => async (context: Context, request: Request, response: Response) => {
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
                dataIngestionPipeline.processFile(uploadedFile).then((requestId) => {
                    requests.push({'Operation-Location': `${getResourceLocation(requestId)}`});
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
            dataIngestionPipeline.processFile(file).then((requestId) => {
                response.status(202).json({'Operation-Location': `${getResourceLocation(requestId)}`});
            }).catch((error) => {
                consoleLogger.info(error);
                response.status(500).json(error);
            });
        }
   }
};

export { uploadEmployeesByFileHandler }