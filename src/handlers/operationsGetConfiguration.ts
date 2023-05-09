import { Response } from "express"
import { Context, Request } from "openapi-backend"
import { ConfigurationManager } from "../ConfigurationManager"
import { instanceToPlain } from "class-transformer";

const operationsGetConfiguration = async (context: Context, request: Request, response: Response) => {
    response.json(instanceToPlain(ConfigurationManager.getInstance().getApplicationConfiguration()));
}

export { operationsGetConfiguration }