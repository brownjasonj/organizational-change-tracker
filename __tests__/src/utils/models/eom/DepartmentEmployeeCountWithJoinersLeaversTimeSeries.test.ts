import { DepartmentEmployeeCountWithJoinersLeaversTimeSeries } from "../../../../../src/models/eom/DepartmentEmployeeCountWithJoinersLeaversTimeSeries";


describe("DepartmentEmployeeCountWithJoinersLeaversTimeSeries test", () => {
    test("Construct instance of DepartmentEmployeeCountWithJoinersLeaversTimeSeries and check the values", async () => {
        const departmentName: string = "123456789";
        const startDate: Date = new Date();
        const endDate: Date = new Date();
        const dateStep: number = 1;
        const departmentEmployeeCountWithJoinersLeaversEpoc = new DepartmentEmployeeCountWithJoinersLeaversTimeSeries(departmentName, startDate, endDate, dateStep);
        expect(departmentEmployeeCountWithJoinersLeaversEpoc.getDepartmentName()).toContain(departmentName);
        expect(departmentEmployeeCountWithJoinersLeaversEpoc.getStartDate()).toEqual(startDate);
        expect(departmentEmployeeCountWithJoinersLeaversEpoc.getEndDate()).toEqual(endDate);
        expect(departmentEmployeeCountWithJoinersLeaversEpoc.getDateStep()).toEqual(dateStep);
    });
  });

