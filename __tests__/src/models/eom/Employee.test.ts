import { Employee } from "../../../../src/models/eom/Employee";

describe("Employee test", () => {
    test("Construct instance of Employee and check the values", async () => {
        const employeeId: string = "123456789";
        const systemId: string = "123456789";
        const firstName: string = "123456789";
        const secondName: string = "123456789";
        const jobTitle: string = "123456789";
        const department: string = "123456789";
        const departmentStartDate: Date = new Date();
        const departmentEndDate: Date = new Date();
        const employmentStartDate: Date = new Date();
        const employmentEndDate: Date = new Date();
        const employee = new Employee(employeeId, systemId, firstName, secondName, department, jobTitle, departmentStartDate, departmentEndDate, employmentStartDate, employmentEndDate);
        expect(employee.getEmployeeId()).toContain(employeeId);
        expect(employee.getSystemId()).toContain(systemId);
        expect(employee.getFirstName()).toContain(firstName);
        expect(employee.getSecondName()).toContain(secondName);
        expect(employee.getJobTitle()).toContain(jobTitle);
        expect(employee.getDepartment()).toContain(department);
        expect(employee.getDepartmentStartDate()).toEqual(departmentStartDate);
        expect(employee.getDepartmentEndDate()).toEqual(departmentEndDate);
        expect(employee.getEmploymentStartDate()).toEqual(employmentStartDate);
        expect(employee.getEmploymentEndDate()).toEqual(employmentEndDate);
    });
  });


