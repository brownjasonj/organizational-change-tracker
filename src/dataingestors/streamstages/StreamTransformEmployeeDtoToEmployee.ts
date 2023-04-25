import { PassThrough, Transform } from "stream";
import { EmployeeDto } from "../../models/dto/EmployeeDto";
import { Employee } from "../../models/eom/Employee";
import { employeeDtoToEmployee } from "../../models/mappers/EmployeeMapper";
import { Logger } from "pino";


class StreamTransformEmployeeDtoToEmployee extends Transform {
    private logger: Logger;
    constructor(logger: Logger) {
        super({ objectMode: true });
        this.logger = logger;
    }

    _write(data: EmployeeDto, encoding: string, callback: Function) {
        this.logger.info(data);
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