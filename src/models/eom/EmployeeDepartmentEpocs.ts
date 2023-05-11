import { EmployeeDepartmentEpoc } from "./EmployeeDepartmentEpoc";

class EmployeeDepartmentEpocs {
    employeeId: string
    epocs: EmployeeDepartmentEpoc[];

    constructor(employeeId: string) {
        this.employeeId = employeeId;
        this.epocs = [];
    }

    getEmployeeId(): string {
        return this.employeeId;
    }

    getEpocs(): EmployeeDepartmentEpoc[] {
        return this.epocs;
    }
    
    addEpoc(epoc: EmployeeDepartmentEpoc) {
        this.epocs.push(epoc);
    }
}

export { EmployeeDepartmentEpocs }