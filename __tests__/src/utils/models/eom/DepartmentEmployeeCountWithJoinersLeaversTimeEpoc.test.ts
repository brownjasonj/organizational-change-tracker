import { DepartmentEmployeeCountWithJoinersLeaversEpoc } from "../../../../../src/models/eom/DepartmentEmployeeCountWithJoinersLeaversTimeEpoc";

describe("DepartmentEmployeeCountWithJoinersLeaversEpoc test", () => {
    test("Construct instance of DepartmentEmployeeCountWithJoinersLeaversEpoc and check the values", async () => {
        const departmentName: string = "123456789";
        const startDate: Date = new Date();
        const endDate: Date = new Date();
        const departmentEmployeeCountWithJoinersLeaversEpoc = new DepartmentEmployeeCountWithJoinersLeaversEpoc(departmentName, startDate, endDate);
        expect(departmentEmployeeCountWithJoinersLeaversEpoc.getDepartment()).toContain(departmentName);
        expect(departmentEmployeeCountWithJoinersLeaversEpoc.getStartDate()).toEqual(startDate);
        expect(departmentEmployeeCountWithJoinersLeaversEpoc.getEndDate()).toEqual(endDate);
        expect(departmentEmployeeCountWithJoinersLeaversEpoc.getNumberOfJoiners()).toEqual(0);
        expect(departmentEmployeeCountWithJoinersLeaversEpoc.getNumberOfLeavers()).toEqual(0);
        expect(departmentEmployeeCountWithJoinersLeaversEpoc.getEmployeeCountAtStart()).toEqual(0);
        expect(departmentEmployeeCountWithJoinersLeaversEpoc.getEmployeeCountAtEnd()).toEqual(0);
    });
  });
