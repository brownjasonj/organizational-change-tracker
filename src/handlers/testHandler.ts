import { Response } from "express";
import { Context, Handler, Request } from "openapi-backend";

const testHandler = (context: Context, request: Request, response: Response) => {
        response.json({ message: 'hello world' });
    };

export default testHandler;