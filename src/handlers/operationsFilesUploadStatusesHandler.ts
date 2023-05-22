import { Context, Request } from "openapi-backend";
import { Response } from "express";
import { DataIngestionStreamStatus, DataIngestionStreamsFactory } from "../dataingestors/DataIngestionStreamsFactory";
import { consoleLogger } from "../logging/consoleLogger";

const operationsFilesUploadStatusesHandler = async (context: Context, request: Request, response: Response) => {
    consoleLogger.info("operationsFilesUploadStatusesHandler");
    if (context.request.params) {
        const streamStatus: DataIngestionStreamStatus[] = DataIngestionStreamsFactory.getInstance().getStreamStatuses()
        consoleLogger.info(streamStatus);
        if (streamStatus) {
            response.status(200).send(streamStatus!);
        }
        else {
            response.status(404).send();
        }
    }
    else {
        response.status(400).send();
    }
}

export { operationsFilesUploadStatusesHandler }