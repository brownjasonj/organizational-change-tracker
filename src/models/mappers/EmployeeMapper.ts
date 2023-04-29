import { EmployeeDto } from "../dto/EmployeeDto";
import { Employee } from "../eom/Employee";

const employeeDtoToEmployee = (employeeDto: EmployeeDto): Employee => {

    const deapartmentStartDateComponents = employeeDto.departmentStartDate.split(".");
    const departmentStartDate = new Date(`${deapartmentStartDateComponents[2]}-${deapartmentStartDateComponents[1]}-${deapartmentStartDateComponents[0]}`);
    departmentStartDate.setHours(0,0,0,0);

    const departmentEndDateComponents = employeeDto.departmentEndDate.split(".");
    const departmentEndDate = new Date(`${departmentEndDateComponents[2]}-${departmentEndDateComponents[1]}-${departmentEndDateComponents[0]}`);
    departmentEndDate.setHours(23,59,59,0);

    const employmentStartDateComponents = employeeDto.employmentStartDate.split(".");
    const employmentStartDate = new Date(`${employmentStartDateComponents[2]}-${employmentStartDateComponents[1]}-${employmentStartDateComponents[0]}`);
    employmentStartDate.setHours(0,0,0,0);

    const employmentEndDateComponents = employeeDto.employmentEndDate.split(".");
    const employmentEndDate = new Date(`${employmentEndDateComponents[2]}-${employmentEndDateComponents[1]}-${employmentEndDateComponents[0]}`);
    employmentEndDate.setHours(23,59,59,0);

    return new Employee(
        employeeDto.employee_id,
        employeeDto.system_id,
        employeeDto.firstName,
        employeeDto.secondName,
        employeeDto.department.replace(/\s/g, ""),
        employeeDto.jobTitle,
        departmentStartDate,
        departmentEndDate,
        employmentStartDate,
        employmentEndDate
    );
}

export { employeeDtoToEmployee }