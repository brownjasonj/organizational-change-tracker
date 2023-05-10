import { CorporateTitle } from "../../../../src/models/eom/CorporateTitle";
import { EmployeeCorporateTitleEpoc } from "../../../../src/models/eom/EmployeeCorporateTitleEpoc";

describe("EmployeeCorporateTitleEpoc test", () => {
    test("Construct instance of EmployeeCorporateTitleEpoc and check the values", async () => {
        const employeeId: string = "123456789";
        const corporateTitle: CorporateTitle = CorporateTitle.AVP;
        const startDate: Date = new Date();
        const endDate: Date = new Date();
        const employeeCorporateTitleEpoc = new EmployeeCorporateTitleEpoc(employeeId, corporateTitle, startDate.toISOString(), endDate.toISOString());
        expect(employeeCorporateTitleEpoc.getEmployeeId()).toEqual(employeeId);
        expect(employeeCorporateTitleEpoc.getCorporateTitle()).toContain(corporateTitle);
        expect(employeeCorporateTitleEpoc.getStartDate()).toEqual(startDate);
        expect(employeeCorporateTitleEpoc.getEndDate()).toEqual(endDate);
    });
  });