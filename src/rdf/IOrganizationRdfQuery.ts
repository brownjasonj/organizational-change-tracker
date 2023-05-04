import { Employee } from "../models/eom/Employee";
import { EmployeeLeaverJoiner } from "../models/eom/EmployeeLeaverJoiner";
import { EmployeeDepartmentEpocs } from "../models/eom/EmployeeDepartmentEpocs";
import { EmployeeCorporateTitleEpocs } from "../models/eom/EmployeeCorporateTitleEpocs";
import { DepartmentEmployeeCountTimeEpoc } from "../models/eom/DepartmentEmployeeCountTimeEpoc";
import { DepartmentEmployeeCountTimeSeries } from "../models/eom/DepartmentEmployeeCountTimeSeries";
import { DepartmentEmployeeCountWithJoinersLeaversTimeSeries } from "../models/eom/DepartmentEmployeeCountWithJoinersLeaversTimeSeries";

interface IOrganizationRdfQuery {
    createBankOrgRdfDataGenerator(employee:Employee): Promise<string>;
    deleteAllTriple(): Promise<any>;
    getDepartmentCodes(asOfDate: Date): Promise<string>;
    getDepartmentEmployeeHistoryWithJoinersAndLeavers(departmentCode: string, startDate: Date, endDate: Date, dateStep: number): Promise<DepartmentEmployeeCountWithJoinersLeaversTimeSeries>;
    getDepartmentEmployeeCountHistory(departmentCode: string, startDate: Date, endDate: Date, dateStep: number): Promise<DepartmentEmployeeCountTimeSeries>;
    getEmployeeCountByDepartmentAsOf(departmentCode: string, asOfDate: Date): Promise<DepartmentEmployeeCountTimeEpoc>;
    getEmployeeDepartmentHistory(): Promise<EmployeeDepartmentEpocs[]>;
    getEmployeeDepartmentHistoryByEmployeeId(employeeId: string): Promise<EmployeeDepartmentEpocs>;
    getEmployeeCorporateTitleHistoryByEmployeeId(employeeId: string): Promise<EmployeeCorporateTitleEpocs>;
    getDepartmentJoiners(departmentCode: string, startDate: Date, endDate: Date): Promise<EmployeeLeaverJoiner[]>;
    getDepartmentLeavers(departmentCode: string, startDate: Date, endDate: Date): Promise<EmployeeLeaverJoiner[]>

    // id lookups
    getEmployeeByEmployeeId(employeeId: string): Promise<any>;
}

export { IOrganizationRdfQuery }