import { PassThrough, Transform } from "stream";
import { Employee } from "../../models/eom/Employee";
import { BankOrgRdfDataGenerator } from "../../rdf/generators/BankOrgRdfDataGenerator";

class StreamTransformEmployeeToRdf extends Transform {
    constructor() {
        super({ objectMode: true });
    }

    _write(data: Employee, encoding: string, callback: Function) {
        BankOrgRdfDataGenerator(data).then((result) => {
            this.push(result);
            callback();
        });
    }

    // When all the data is done passing, it stops.
    _final() {
        this.push(null);
    }
}

export { StreamTransformEmployeeToRdf }