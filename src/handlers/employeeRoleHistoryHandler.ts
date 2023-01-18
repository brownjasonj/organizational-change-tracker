import { Response } from "express"
import { Context, Request } from "openapi-backend"


const employeeRoleHistoryHandler = async (context: Context, request: Request, response: Response) => {
    console.log(request.body);
    response.json({ message: "done" });
}

export { employeeRoleHistoryHandler }