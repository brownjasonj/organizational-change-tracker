import { EmployeeLeaverJoiner } from "./EmployeeLeaverJoiner";

class DepartmentEmployeeCountWithJoinersLeaversEpoc {
    department: string;
    startDate: Date;
    endDate: Date
    employeesAtStart: number;
    employeesAtEnd: number
    numberOfLeavers: number;
    numberOfJoiners: number;
    leavers: EmployeeLeaverJoiner[];
    joiners: EmployeeLeaverJoiner[];

  
    constructor(departmentName: string, startDate: Date, endDate: Date) {
      this.department = departmentName;
      this.startDate = startDate;
      this.endDate = endDate;
      this.employeesAtStart = 0;
      this.employeesAtEnd = 0;
      this.numberOfJoiners = 0;
      this.numberOfLeavers = 0
      this.leavers = [];
      this.joiners = [];
    }

    setEmployeeCountAtStart(count: number) {
        this.employeesAtStart = count;
    }

    setEmployeeCountAtEnd(count: number) {
        this.employeesAtEnd = count;
    }

    addLeavers(leavers: EmployeeLeaverJoiner[]): void {
        this.leavers = this.leavers.concat(leavers);
        this.numberOfLeavers += leavers.length;
    }

    addJoiners(joiners: EmployeeLeaverJoiner[]): void {
        this.joiners = this.joiners.concat(joiners);
        this.numberOfJoiners += joiners.length;
    }
  }

  export { DepartmentEmployeeCountWithJoinersLeaversEpoc }