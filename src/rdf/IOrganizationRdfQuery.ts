import { Employee } from "../models/eom/Employee";
import { DepartmentTimeSeries } from "../models/eom/DepartmentTimeSeries";
import { EmployeeLeaverJoiner } from "../models/eom/EmployeeLeaverJoiner";
import { EmployeeCountByDepartmentTimeEpoc } from "../models/eom/EmployeeCountByDepartmentTimeEpoc";
import { EmployeeDepartmentEpocs } from "../models/eom/EmployeeDepartmentEpocs";
import { EmployeeCorporateTitleEpocs } from "../models/eom/EmployeeCorporateTitleEpocs";

interface IOrganizationRdfQuery {
    createBankOrgRdfDataGenerator(employee:Employee): Promise<string>;
    deleteAllTriple(): Promise<any>;
    getDepartmentCodes(asOfDate: Date): Promise<string>;
    getDepartmentHistory(departmentCode: string, startDate: Date, endDate: Date, dateStep: number): Promise<DepartmentTimeSeries>;
    getEmployeeCountByDepartmentCode(departmentCode: string, asOfDate: Date): Promise<EmployeeCountByDepartmentTimeEpoc>;
    getEmployeeDepartmentHistory(): Promise<EmployeeDepartmentEpocs[]>;
    getEmployeeDepartmentHistoryByEmployeeId(employeeId: string): Promise<EmployeeDepartmentEpocs>;
    getEmployeeCorporateTitleHistoryByEmployeeId(employeeId: string): Promise<EmployeeCorporateTitleEpocs>;
    getDepartmentJoiners(departmentCode: string, startDate: Date, endDate: Date): Promise<EmployeeLeaverJoiner[]>;
    getDepartmentLeavers(departmentCode: string, startDate: Date, endDate: Date): Promise<EmployeeLeaverJoiner[]>
}

export { IOrganizationRdfQuery }