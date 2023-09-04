import { Response } from "express";
import { Context, Request } from "openapi-backend";
import { IOrganizationRdfQuery } from "../rdf/IOrganizationRdfQuery";
import { DepartmentHierarchy } from "../models/eom/DepartmentHierarchy";
import { instanceToPlain } from "class-transformer";

/*
    /department/hierachy/{departmentcode}/{depth}/{asofdate}
*/
const departmentJierarchyByDepartmentCodeWithDepthFromDateToDate =  (rdfOrganization: IOrganizationRdfQuery) => async (context: Context, request: Request, response: Response) => {
    if (context.request.params.departmentcode
        && context.request.params.depth
        && context.request.params.asofdate) {
        try {
            const result:DepartmentHierarchy = await rdfOrganization.getDepartmentHierarchyDepthHistory(context.request.params.departmentcode as string, Number.parseInt(context.request.params.depth as string), new Date(context.request.params.asofdate as string));
            console.log(result);
            response.json(instanceToPlain(result));
            return;
        }
        catch (err) {
            response.status(500).json({err});
            return;
        }
    }
    else {
        response.status(400).json({error: 'Missing required parameters'});
    }
}



export { departmentJierarchyByDepartmentCodeWithDepthFromDateToDate };