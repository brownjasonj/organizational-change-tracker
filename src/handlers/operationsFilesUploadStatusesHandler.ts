import { Context, Request } from "openapi-backend";
import { Response } from "express";
import { consoleLogger } from "../logging/consoleLogger";
import { DataIngestionStreamStatuses } from "../dataingestors/DataIngestionStreamStatuses";
import { DataIngestionStreamStatus } from "../dataingestors/DataIngestionStreamStatus";

const operationsFilesUploadStatusesHandler = (dataIngestionStatuses: DataIngestionStreamStatuses) => async (context: Context, request: Request, response: Response) => {
    consoleLogger.info("operationsFilesUploadStatusesHandler");
    if (context.request.params) {
        const streamStatus: DataIngestionStreamStatus[] = dataIngestionStatuses.getStreamStatuses()
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