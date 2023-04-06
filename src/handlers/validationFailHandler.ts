import { Response } from "express";
import { Context, Handler, Request } from "openapi-backend";

const validationFailHandler = (context: Context, request: Request, response: Response) => {
        response.status(400).json({ err: context.validation.errors });
    };

export { validationFailHandler };