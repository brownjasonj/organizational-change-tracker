import { Response } from "express";
import { Context, Request } from "openapi-backend";
import { IOrganizationRdfQuery } from "../rdf/IOrganizationRdfQuery";
import { RdfGraphFactory } from "../rdf/RdfGraphFactory";
import { DepartmentEmployeeCountWithJoinersLeaversTimeSeries } from "../models/eom/DepartmentEmployeeCountWithJoinersLeaversTimeSeries";

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

const departmentHistoryWithJoinersLeaversHandler = async (context: Context, request: Request, response: Response) => {
    if (context.request.query.departmentCode
        && context.request.query.startDate) {
        const departmentCode: string = context.request.query.departmentCode as string;
        const startDate: Date = new Date(context.request.query.startDate as string);
        // set the start date time to 00:00:00
        // startDate.setHours(1,0,0,0);
        var endDate: Date;
        var dateStep: number;
        if (context.request.query.endDate) {
            endDate = new Date (context.request.query.endDate as string);
        }
        else {
            endDate = new Date();
        }
        // set the end date time to 23:59:59
        endDate.setHours(23,59,59,0);

        if (context.request.query.dateStep) {
            dateStep = getDateStep(context.request.query.dateStep as string);
        }
        else {
            dateStep = getDateStep('day');
        }

        console.log(`departmentCode: ${departmentCode}`);
        const rdfOrganization: IOrganizationRdfQuery = RdfGraphFactory.getInstance().getOrganizationRdfGraph();

        try {
            const timeseries: DepartmentEmployeeCountWithJoinersLeaversTimeSeries = await rdfOrganization.getDepartmentEmployeeHistoryWithJoinersAndLeavers(departmentCode, startDate, endDate, dateStep);
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

export { departmentHistoryWithJoinersLeaversHandler }