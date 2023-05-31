import { Response } from "express";
import { Context, Request } from "openapi-backend";
import { IOrganizationRdfQuery } from "../rdf/IOrganizationRdfQuery";
import { DepartmentEmployeeCountTimeSeries } from "../models/eom/DepartmentEmployeeCountTimeSeries";
import { Calendar } from "../utils/Calendar";

const getDateStep = (dateStep: string): number => {
    switch (dateStep) {
        case 'day':
            return 1;
        case 'week':
            return 7;
        case 'month':
            return 30;
        case 'year':
            return 365;
        default:
            return 7;
    }
}

const employeeCountByDepartmentCodeFromDateToDateHandler =  (rdfOrganization: IOrganizationRdfQuery) => async (context: Context, request: Request, response: Response) => {
    if (context.request.params.departmentcode
        && context.request.params.fromdate
        && context.request.params.todate) {
        const departmentCode: string = context.request.params.departmentcode as string;
        const fromDate: Date = Calendar.getStartOfDay(new Date(context.request.params.fromdate as string));
        const toDate: Date = Calendar.getEndOfDay(new Date(context.request.params.todate as string));

        var dateStep: number;
        if (context.request.query.datestep) {
            dateStep = getDateStep(context.request.query.datestep as string);
        }
        else {
            dateStep = getDateStep('month');
        }

        console.log(`departmentCode: ${departmentCode}`);

        try {
            const timeseries: DepartmentEmployeeCountTimeSeries = await rdfOrganization.getDepartmentEmployeeCountHistory(departmentCode, fromDate, toDate, dateStep);
            response.json(timeseries);
            return;
        }
        catch (err) {
            console.log(err);
            response.status(500).json(err);
            return;
        }
    }
    else {
        response.status(400).send("Missing required parameters");
    }
}

export { employeeCountByDepartmentCodeFromDateToDateHandler }