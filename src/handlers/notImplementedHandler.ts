import { countReset } from "console";
import { Response } from "express";
import { Context, Handler, Request } from "openapi-backend";

const notImplementedHandler = (context: Context, request: Request, response: Response) => {
    if (context.operation.operationId) {
        const { status, mock } = context.api.mockResponseForOperation(context.operation.operationId);
        return response.status(status).json(mock);
    }
    else {
        response.status(404).json({ err: 'not found' })
    }
};

export { notImplementedHandler };


/*
api.register('notImplemented', (c, req, res) => {
    const { status, mock } = c.api.mockResponseForOperation(c.operation.operationId);
    return res.status(status).json(mock);
  });
*/