import { Employee } from "../models/eom/Employee";
import { EmployeeLeaverJoiner } from "../models/eom/EmployeeLeaverJoiner";
import { EmployeeDepartmentEpocs } from "../models/eom/EmployeeDepartmentEpocs";
import { EmployeeCorporateTitleEpocs } from "../models/eom/EmployeeCorporateTitleEpocs";
import { DepartmentEmployeeCountTimeEpoc } from "../models/eom/DepartmentEmployeeCountTimeEpoc";
import { DepartmentEmployeeCountTimeSeries } from "../models/eom/DepartmentEmployeeCountTimeSeries";
import { DepartmentEmployeeCountWithJoinersLeaversTimeSeries } from "../models/eom/DepartmentEmployeeCountWithJoinersLeaversTimeSeries";
import { DepartmentHierarchy } from "../models/eom/DepartmentHierarchy";


enum SparqlQueryResultType {
    CSV = "text/csv",
    TSV = "text/tsv",
    JSON = "application/sparql-results+json",
    XML = "application/sparql-results+xml",
    TABLE = "application/x-binary-rdf-results-table"
}

interface IRdfGraphUpdateResponse {
    responseTime: number;
}


interface IOrganizationRdfQuery {
    createBankOrgRdfDataGenerator(employee:Employee): Promise<string>;

    sparqlQuery: (query: string, resultType: SparqlQueryResultType) => Promise<any>;
    saveTurtle: (turtle: string) => Promise<IRdfGraphUpdateResponse>;

    deleteAllTriple(): Promise<any>;
    getDepartmentCodesAsOfDate(asOfDate: Date): Promise<string>;
    getDepartmentEmployeeHistoryWithJoinersAndLeavers(departmentCode: string, startDate: Date, endDate: Date, dateStep: number): Promise<DepartmentEmployeeCountWithJoinersLeaversTimeSeries>;
    getDepartmentEmployeeCountHistory(departmentCode: string, startDate: Date, endDate: Date, dateStep: number): Promise<DepartmentEmployeeCountTimeSeries>;
    getDepartmentHierarchyDepthHistory(departmentCode: string, hierarchyDepth: number, startDate: Date): Promise<DepartmentHierarchy>;
    getEmployeeCountByDepartmentAsOf(departmentCode: string, asOfDate: Date): Promise<DepartmentEmployeeCountTimeEpoc>;
    getEmployeeDepartmentHistoryByEmployeeId(employeeId: string): Promise<EmployeeDepartmentEpocs>;
    getEmployeeCorporateTitleHistoryByEmployeeId(employeeId: string): Promise<EmployeeCorporateTitleEpocs>;
    getDepartmentJoiners(departmentCode: string, startDate: Date, endDate: Date): Promise<EmployeeLeaverJoiner[]>;
    getDepartmentLeavers(departmentCode: string, startDate: Date, endDate: Date): Promise<EmployeeLeaverJoiner[]>
    getEmployeesByDepartmentCodeAsOfDate(departmentCode: string, asOfDate: Date): Promise<any>;

    // id lookups
    getEmployeeByEmployeeSystemId(employeeSystemId: string): Promise<any>;
    getEmployeeByEmployeeId(employeeId: string): Promise<any>;
    getOrganizationByOrganizationId(organizationId: string): Promise<any>;
    getMembershipByMembershipId(membershipId: string): Promise<any>;
    getTimeByTimeId(timeId: string): Promise<any>;
    getTimeIntervalByTimeIntervalId(timeIntervalId: string): Promise<any>;
}

export { SparqlQueryResultType, IRdfGraphUpdateResponse, IOrganizationRdfQuery }