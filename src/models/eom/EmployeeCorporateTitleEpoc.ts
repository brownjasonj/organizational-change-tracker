import { CorporateTitle } from "./CorporateTitle";

class EmployeeCorporateTitleEpoc {
    employeeId: string;
    corporateTitle: CorporateTitle;
    startdate: Date;
    enddate: Date;

    constructor(employeeId: string, corporateTitle: CorporateTitle, startdate: Date, enddate: Date) {
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

    getStartDate(): Date {
        return this.startdate;
    }

    getEndDate(): Date {      
        return this.enddate;
    }
}

export { EmployeeCorporateTitleEpoc }