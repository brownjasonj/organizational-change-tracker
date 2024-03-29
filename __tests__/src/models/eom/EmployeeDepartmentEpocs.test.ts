import { EmployeeDepartmentEpoc } from "../../../../src/models/eom/EmployeeDepartmentEpoc";
import { EmployeeDepartmentEpocs } from "../../../../src/models/eom/EmployeeDepartmentEpocs";


describe("EmployeeDepartmentEpocs test", () => {
    test("Construct instance of EmployeeDepartmentEpocs and check the values", async () => {
        const employeeId: string = "123456789";
        const departmentName: string = "departmentName";
        const startDate: Date = new Date();
        const endDate: Date = new Date();

        const employeeDepartmentEpocs = new EmployeeDepartmentEpocs(employeeId);
        expect(employeeDepartmentEpocs.getEmployeeId()).toEqual(employeeId);
        expect(employeeDepartmentEpocs.getEpocs()).toEqual([]);

        const employeeDepartmentEpoc = new EmployeeDepartmentEpoc(employeeId, departmentName, startDate, endDate);
        employeeDepartmentEpocs.addEpoc(employeeDepartmentEpoc);
        expect(employeeDepartmentEpocs.getEpocs()).toEqual([employeeDepartmentEpoc]);
    });
});