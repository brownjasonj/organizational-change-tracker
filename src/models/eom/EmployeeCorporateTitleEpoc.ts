import { CorporateTitle } from "./CorporateTitle";

class EmployeeCorporateTitleEpoc {
    employeeId: string;
    corporateTitle: CorporateTitle;
    startdate: string;
    enddate: string;

    constructor(employeeId: string, corporateTitle: CorporateTitle, startdate: string, enddate: string) {
        this.employeeId = employeeId;
        this.corporateTitle = corporateTitle;
        this.startdate = startdate;
        this.enddate = enddate;
    }

    getEmployeeId(): string {
        return this.employeeId;
    }

    getCorporateTitle(): CorporateTitle {
        return this.corporateTitle;
    }

    getStartDate(): string {
        return this.startdate;
    }

    getEndDate(): string {      
        return this.enddate;
    }
}

export { EmployeeCorporateTitleEpoc }