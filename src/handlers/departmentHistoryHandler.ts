import { Response } from "express";
import { Context, Request } from "openapi-backend";
import { BlazeGraph, BlazeGraphOptions, SparqlQueryResultType } from "../persistence/blazegraph/blazegraph";
import { Employee } from "../models/eom/Employee";

const blazeGraphOptions: BlazeGraphOptions = new BlazeGraphOptions({});
const blazegraph: BlazeGraph = new BlazeGraph(new BlazeGraphOptions({}));

const getSparqlQuery = (departmentCode: string, asOf: Date): Promise<HistoricPoint> => {
    const sparqlQuery = `prefix : <http://example.org/id#>
    prefix csorg: <http://example.org/org#>
    prefix foaf: <http://xmlns.com/foaf/0.1#>
    prefix org: <http://www.w3.org/ns/org#>
    prefix time: <http://www.w3.org/2006/time#>
    prefix pid: <http://example.org/pid#>
    prefix interval: <http://example.org/interval#>
    prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    prefix xsd: <http://www.w3.org/2000/01/rdf-schema#>
    
    SELECT  ?name
            (count(distinct ?member) as ?count)
    WHERE {
        ?parentorg org:name "${departmentCode}".                   #find parent organization with given name for which you want to count employees
        ?parentorg org:name ?name.
        ?member org:organization ?org.              # find all members of the organization
        ?org org:subOrganizationOf* ?parentorg.     # where the organization is a suborganization of the parent organization
        ?member org:memberDuring ?interval.         # determine when the member was a member of the organization
        ?interval time:hasBeginning ?start.
        ?interval time:hasEnd ?end.
        ?start time:inXSDDateTime ?date1.
        ?end time:inXSDDateTime ?date2.
        filter (
            ?date1 <= "${asOf.toISOString()}"
            && ?date2 >= "${asOf.toISOString()}").
    }
    GROUP BY ?name ?count
    `;

    console.log(sparqlQuery);
    return new Promise((resolve, reject) => {
        blazegraph.sparqlQuery(sparqlQuery, SparqlQueryResultType.JSON)
        .then((result) => {
            console.log(result);
            if (result.results.bindings.length > 0)
                resolve(new HistoricPoint(departmentCode, asOf, result.results.bindings[0].count.value));
            else 
                resolve(new HistoricPoint(departmentCode, asOf, 0));
        })
        .catch((error) => {
            console.log(error);
            return reject(error);
        });
    });
}

class HistoricPoint {
  department: string;
  date: Date;
  size: number;

  constructor(departmentName: string, date: Date, size: number) {
    this.department = departmentName;
    this.date = date;
    this.size = size;
  }
}


class DepartmentHistory {
    departmentName: string;
    startDate: Date;
    endDate: Date;
    dateStep: number;
    timeseries: HistoricPoint[];

    constructor(departmentName: string, startDate: Date, endDate: Date, dateStep: number) {
        this.departmentName = departmentName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.dateStep = dateStep;
        this.timeseries = [];
    }

    addPoint(point: HistoricPoint): void {
        if (point)
            this.timeseries.push(point);
    }
}

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

const departmentHistoryHandler = async (context: Context, request: Request, response: Response) => {
    if (request.query) {
        if (typeof(request.query === 'object')) {
            const queryParams: {[key: string]: string | string[]} = Object.assign({}, (Object)(request.query));
            const departmentCode: string = queryParams.departmentCode as string;
            const startDate: Date = new Date(queryParams.startDate as string);
            // set the start date time to 00:00:00
            startDate.setHours(1,0,0,0);
            var endDate: Date;
            var dateStep: number;
            if (queryParams.endDate) {
                endDate = new Date (queryParams.endDate as string);
            }
            else {
                endDate = new Date();
            }
            // set the end date time to 23:59:59
            endDate.setHours(23,59,59,0);
            dateStep = getDateStep(queryParams.dateStep as string);

            const timeseries: DepartmentHistory = new DepartmentHistory(departmentCode, startDate, endDate, dateStep);

            
            for(var currentDate: Date = startDate; currentDate <= endDate; currentDate = new Date(currentDate.getTime() + 1000*60*60*24 * dateStep)) {
//                console.log(`next ${currentDate}`);
                await getSparqlQuery(departmentCode, currentDate)
                .then((result) => {
//                    timeseries.addPoint(new HistoricPoint(departmentCode, currentDate, 1));
                    console.log(result);
                    timeseries.addPoint(result);
                })
                .catch((error) => {
                    console.log(error);
                });
            }

            response.json(timeseries);            
        }
    }
}

export { departmentHistoryHandler }