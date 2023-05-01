import { EmployeeLeaverJoiner } from "./EmployeeLeaverJoiner";

class DepartmentEmployeeCountTimeEpoc {
    department: string;
    startDate: Date;
    endDate: Date;
    employeeCount: number;
  
    constructor(departmentName: string, startDate: Date, endDate: Date, employeeCount: number) {
        this.department = departmentName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.employeeCount = employeeCount;
    }

    getEmployeeCount(): number {
        return this.employeeCount;
    }
  }


  export { DepartmentEmployeeCountTimeEpoc }