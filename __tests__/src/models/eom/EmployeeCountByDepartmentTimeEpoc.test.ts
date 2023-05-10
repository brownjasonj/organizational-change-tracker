import { EmployeeLeaverJoiner } from "./EmployeeLeaverJoiner.test";

class EmployeeCountByDepartmentTimeEpoc {
    department: string;
    date: Date;
    size: number;
    leavers: EmployeeLeaverJoiner[];
    joiners: EmployeeLeaverJoiner[];

  
    constructor(departmentName: string, date: Date, size: number) {
      this.department = departmentName;
      this.date = date;
      this.size = size;
      this.leavers = [];
      this.joiners = [];
    }

    addLeaver(leaver: EmployeeLeaverJoiner): void {
      this.leavers.push(leaver);
    }

    addJoiner(joiner: EmployeeLeaverJoiner): void {
      this.joiners.push(joiner);
    }
  }

  export { EmployeeCountByDepartmentTimeEpoc }