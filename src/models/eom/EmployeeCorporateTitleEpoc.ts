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
}

export { EmployeeCorporateTitleEpoc }