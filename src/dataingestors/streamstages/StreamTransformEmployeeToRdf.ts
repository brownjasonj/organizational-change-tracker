import { PassThrough, Transform } from "stream";
import { Employee } from "../../models/eom/Employee";
import { BankOrgRdfDataGenerator } from "../../rdf/generators/BankOrgRdfDataGenerator";
import { Logger } from "pino";

class StreamTransformEmployeeToRdf extends Transform {
    private logger: Logger;

    constructor(logger: Logger) {
        super({ objectMode: true });
        this.logger = logger;
    }

    _write(data: Employee, encoding: string, callback: Function) {
        BankOrgRdfDataGenerator(data).then((result) => {
            this.logger.info(result);
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