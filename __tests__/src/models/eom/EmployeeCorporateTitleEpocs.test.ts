import { CorporateTitle } from "../../../../src/models/eom/CorporateTitle";
import { EmployeeCorporateTitleEpoc } from "../../../../src/models/eom/EmployeeCorporateTitleEpoc";
import { EmployeeCorporateTitleEpocs } from "../../../../src/models/eom/EmployeeCorporateTitleEpocs";


describe("EmployeeCorporateTitleEpocs test", () => {
    test("Construct instance of EmployeeCorporateTitleEpocs and check the values", async () => {
        const employeeId: string = "123456789";
        const corporateTitle: CorporateTitle = CorporateTitle.AVP;
        const startDate: Date = new Date();
        const endDate: Date = new Date();
        const employeeCorporateTitleEpoc = new EmployeeCorporateTitleEpoc(employeeId, corporateTitle, startDate.toISOString(), endDate.toISOString());
        const employeeCorporateTitleEpocs = new EmployeeCorporateTitleEpocs(employeeId);
        expect(employeeCorporateTitleEpocs.getEmployeeId()).toEqual(employeeId);
        expect(employeeCorporateTitleEpocs.getEpocs()).toEqual([]);

        employeeCorporateTitleEpocs.addEpoc(employeeCorporateTitleEpoc);
        expect(employeeCorporateTitleEpocs.getEpocs()).toEqual([employeeCorporateTitleEpoc]);
    });
  });
