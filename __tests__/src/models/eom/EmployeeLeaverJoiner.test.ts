import { EmployeeLeaverJoiner, EmployeeLeaverJoinerType } from "../../../../src/models/eom/EmployeeLeaverJoiner";

describe("EmployeeLeaverJoiner test", () => {
    test("Construct instance of EmployeeLeaverJoiner and check the values", async () => {
        const leaverJoinerType = EmployeeLeaverJoinerType.LEAVER;
        const employeeId: string = "123456789";
        const departmentName: string = "departmentName";
        const date: Date = new Date();

        const employeeLeaverJoiner = new EmployeeLeaverJoiner(employeeId, departmentName, date, leaverJoinerType);
        expect(employeeLeaverJoiner.getEmployeeId()).toEqual(employeeId);
        expect(employeeLeaverJoiner.getDepartment()).toEqual(departmentName);
        expect(employeeLeaverJoiner.getDate()).toEqual(date);
        expect(employeeLeaverJoiner.getStatus()).toEqual(leaverJoinerType);
    });
  });
