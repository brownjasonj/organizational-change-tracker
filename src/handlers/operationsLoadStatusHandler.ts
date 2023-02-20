import { Context, Request } from "openapi-backend";
import { Response } from "express";
import { DataIngestionStreamStatus, DataIngestionStreamsFactory } from "../dataingestors/DataIngestionStreamsFactory";

const operationsLoadStatusHandler = async (context: Context, request: Request, response: Response) => {
    console.log("operationsLoadStatusHandler");
    if (context.request.params) {
        const streamStatus: DataIngestionStreamStatus | undefined = DataIngestionStreamsFactory.getStreamStatus(context.request.params.requestid as string)
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


// const operationsLoadStatusHandler = async (context: Context, request: Request, response: Response) => {
//     console.log("operationsLoadStatusHandler");
//     console.log(context.request.params.requestid);
//     response.json({ "status": "ok" });
// }

export { operationsLoadStatusHandler }