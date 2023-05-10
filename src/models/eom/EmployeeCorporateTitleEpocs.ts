import { EmployeeCorporateTitleEpoc } from "./EmployeeCorporateTitleEpoc";

class EmployeeCorporateTitleEpocs {
    employeeId: string
    epocs: EmployeeCorporateTitleEpoc[];

    constructor(employeeId: string) {
        this.employeeId = employeeId;
        this.epocs = [];
    }

    getEmployeeId(): string {
        return this.employeeId;
    }

    getEpocs(): EmployeeCorporateTitleEpoc[] {
        return this.epocs;
    }
    
    addEpoc(epoc: EmployeeCorporateTitleEpoc) {
        this.epocs.push(epoc);
    }
}

export { EmployeeCorporateTitleEpocs }