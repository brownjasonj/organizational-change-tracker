import { DepartmentEmployeeCountTimeEpoc } from "../../../../src/models/eom/DepartmentEmployeeCountTimeEpoc";

describe("DepartmentEmployeeCountTimeEpoc test", () => {
    test("Construct instance of DepartmentEmployeeCountTimeEpoc and check the values", async () => {
        const departmentName: string = "123456789";
        const startDate: Date = new Date();
        const endDate: Date = new Date();
        const employeeCount: number = 1;
        const departmentEmployeeCount = new DepartmentEmployeeCountTimeEpoc(departmentName, startDate, endDate, employeeCount);
        expect(departmentEmployeeCount.getDepartment()).toContain(departmentName);
        expect(departmentEmployeeCount.getStartDate()).toEqual(startDate);
        expect(departmentEmployeeCount.getEndDate()).toEqual(endDate);
        expect(departmentEmployeeCount.getEmployeeCount()).toEqual(employeeCount);
    });
  });
