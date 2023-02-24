
class DepartmentTimeEpoc {
    department: string;
    date: Date;
    size: number;
  
    constructor(departmentName: string, date: Date, size: number) {
      this.department = departmentName;
      this.date = date;
      this.size = size;
    }
  }

  export { DepartmentTimeEpoc }