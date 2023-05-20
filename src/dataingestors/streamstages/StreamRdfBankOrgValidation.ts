import { PassThrough } from "stream";
import { Logger } from "pino";
import { RdfSchemaValidation } from "../../rdf/RdfSchemaValidation";


class StreamRdfBankOrgValidation extends PassThrough {
    private rdfSchemaValidator: RdfSchemaValidation | undefined;
    private logger: Logger;
    
    constructor(rdfSchemaValidator: RdfSchemaValidation | undefined, logger: Logger) {
        super({ objectMode: true });
        this.rdfSchemaValidator = rdfSchemaValidator;
        this.logger = logger;
    }

    _write(data: string, encoding: string, callback: Function) {
        if (this.rdfSchemaValidator?.validationEnabled() ?? false) {
            this.logger.info("Validating the following data: ");
            const conforms = this.rdfSchemaValidator!.validate(data);
            if (conforms) {
                this.logger.info("Validation passed for the following data: ");
                this.push(data);
            }
            else {
                this.logger.error("Validation failed for the following data: ");
                this.logger.error(data);
            }
            callback();
        }
        else {
            this.push(data);
            callback();
        }
    }

    // When all the data is done passing, it stops.
    _final() {
        this.push(null);
    }
}

export { StreamRdfBankOrgValidation }