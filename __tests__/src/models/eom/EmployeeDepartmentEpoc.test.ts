import { EmployeeDepartmentEpoc } from "../../../models/eom/EmployeeDepartmentEpoc";


describe("EmployeeDepartmentEpoc test", () => {
    test("Construct instance of EmployeeDepartmentEpoc and check the values", async () => {
        const employeeId: string = "123456789";
        const departmentName: string = "departmentName";
        const startDate: Date = new Date();
        const endDate: Date = new Date();
        const employeeDepartmentEpoc = new EmployeeDepartmentEpoc(employeeId, departmentName, startDate.toISOString(), endDate.toISOString());
        expect(employeeDepartmentEpoc.getEmployeeId()).toEqual(employeeId);
        expect(employeeDepartmentEpoc.getDepartment).toEqual(departmentName);
        expect(employeeDepartmentEpoc.getStartDate()).toEqual(startDate.toISOString());
        expect(employeeDepartmentEpoc.getEndDate()).toEqual(endDate.toISOString());
    });
  });