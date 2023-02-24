import { EmployeeDepartmentEpoc } from "./EmployeeDepartmentEpoc";

class EmployeeDepartmentEpocs {
    employeeId: string
    epocs: EmployeeDepartmentEpoc[];

    constructor(employeeId: string) {
        this.employeeId = employeeId;
        this.epocs = [];
    }

    addEpoc(epoc: EmployeeDepartmentEpoc) {
        this.epocs.push(epoc);
    }
}

export { EmployeeDepartmentEpocs }