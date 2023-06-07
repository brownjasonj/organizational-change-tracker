import { Context, Request } from "openapi-backend";
import { Response } from "express";
import { DataIngestionStreamStatuses } from "../dataingestors/DataIngestionStreamStatuses";
import { DataIngestionStreamStatus } from "../dataingestors/DataIngestionStreamStatus";

const operationsFileUploadStatusByRequestIdHandler = (dataIngestionStatuses: DataIngestionStreamStatuses) => async (context: Context, request: Request, response: Response) => {
    console.log("operationsFileUploadStatusByRequestIdHandler");
    if (context.request.params) {
        const streamStatus: DataIngestionStreamStatus | undefined = dataIngestionStatuses.getStreamStatus(context.request.params.requestid as string)
        console.log(streamStatus);
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


// const operationsFileUploadStatusByRequestIdHandler = async (context: Context, request: Request, response: Response) => {
//     console.log("operationsFileUploadStatusByRequestIdHandler");
//     console.log(context.request.params.requestid);
//     response.json({ "status": "ok" });
// }

export { operationsFileUploadStatusByRequestIdHandler }