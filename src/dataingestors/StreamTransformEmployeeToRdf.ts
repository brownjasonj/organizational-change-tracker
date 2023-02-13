import { Duplex } from "stream";
import { Employee } from "../models/eom/Employee";
import { BankOrgRdfDataGenerator } from "../rdf-generators/BankOrgRdfDataGenerator";

class StreamTransformEmployeeToRdf extends Duplex {
    constructor() {
        super({ objectMode: true });
    }

    _write(data: Employee, encoding: string, callback: Function) {
        console.log(data);
        BankOrgRdfDataGenerator(data).then((result) => {
            this.push(result);
            callback();
        });
    }

    _read() {
        // do nothing
    }
}

export { StreamTransformEmployeeToRdf }