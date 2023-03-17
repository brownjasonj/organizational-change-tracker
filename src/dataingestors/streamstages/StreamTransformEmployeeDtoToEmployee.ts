import { PassThrough, Transform } from "stream";
import { EmployeeDto } from "../../models/dto/EmployeeDto";
import { Employee } from "../../models/eom/Employee";
import { employeeDtoToEmployee } from "../../models/mappers/EmployeeMapper";


class StreamTransformEmployeeDtoToEmployee extends Transform {
    constructor() {
        super({ objectMode: true });
    }

    _write(data: EmployeeDto, encoding: string, callback: Function) {
        console.log(data);
        const employeeRecord: Employee = employeeDtoToEmployee(data);
        this.push(employeeRecord);
        callback();
    }

    // When all the data is done passing, it stops.
    _final() {
        this.push(null);
    }
}

export { StreamTransformEmployeeDtoToEmployee }