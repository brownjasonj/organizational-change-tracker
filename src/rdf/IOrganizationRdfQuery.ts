import { DepartmentTimeEpoc } from "../models/eom/DepartmentTimeEpoc";
import { Employee } from "../models/eom/Employee";

interface IOrganizationRdfQuery {
    createBankOrgRdfDataGenerator(employee:Employee): Promise<string>;
    getDepartmentCodes(asOfDate: Date): string;
    getDepartmentHistory(departmentCode: string, startDate: Date, endDate: Date): Promise<DepartmentTimeEpoc>;
    getEmployeeCountByDepartmentCode(departmentCode: string, asOf: string): string;
    getEmployeeDepartmentHistory(): string;
    sparqlRoleHistoryQuery(employeeId: string): string;
}

export { IOrganizationRdfQuery }