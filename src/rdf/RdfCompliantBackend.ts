import { DepartmentTimeEpoc } from "../models/eom/DepartmentTimeEpoc";
import { Employee } from "../models/eom/Employee";
import { IRdfGraphDB } from "../persistence/IRdfGraphDB";
import { IOrganizationRdfQuery } from "./IOrganizationRdfQuery";

abstract class RdfCompliantBackend implements IOrganizationRdfQuery {
    private graphDB: IRdfGraphDB;

    constructor(graphDB: IRdfGraphDB) {
        this.graphDB = graphDB;
    }

    createBankOrgRdfDataGenerator(employee: Employee): Promise<string> {
        throw new Error("Method not implemented.");
    }

    getDepartmentCodes(asOfDate: Date): string {
        throw new Error("Method not implemented.");
    }

    getDepartmentHistory(departmentCode: string, startDate: Date, endDate: Date): Promise<DepartmentTimeEpoc> {
        throw new Error("Method not implemented.");
    }

    getEmployeeCountByDepartmentCode(departmentCode: string, asOf: string): string {
        throw new Error("Method not implemented.");
    }

    getEmployeeDepartmentHistory(): string {
        throw new Error("Method not implemented.");
    }
    
    sparqlRoleHistoryQuery(employeeId: string): string {
        throw new Error("Method not implemented.");
    }
    
}

export { RdfCompliantBackend }