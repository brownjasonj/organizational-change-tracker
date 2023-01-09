import { Response } from "express";
import { Context, Request } from "openapi-backend";

const employeeCountByDepartmentCodeHandler = async (context: Context, request: Request, response: Response) => {
    response.json({ message: "done" });
}

export { employeeCountByDepartmentCodeHandler };