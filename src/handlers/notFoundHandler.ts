import { Response } from "express";
import { Context, Handler, Request } from "openapi-backend";

const notFoundHandler = (context: Context, request: Request, response: Response) => {
        response.status(404).json({ err: 'not found' })
    };

export { notFoundHandler };