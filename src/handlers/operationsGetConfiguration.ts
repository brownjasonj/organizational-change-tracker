import { Response } from "express"
import { Context, Request } from "openapi-backend"
import { ConfigurationManager } from "../ConfigurationManager"

const operationsGetConfiguration = async (context: Context, request: Request, response: Response) => {
    response.json(ConfigurationManager.getInstance().getApplicationConfiguration());
}

export { operationsGetConfiguration }