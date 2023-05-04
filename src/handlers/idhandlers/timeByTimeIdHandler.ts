import { Response } from "express";
import { Context, Handler, Request } from "openapi-backend";

const timeByTimeIdHandler = async (context: Context, request: Request, response: Response) => {
    response.json({ message: "done" });
}

export { timeByTimeIdHandler}