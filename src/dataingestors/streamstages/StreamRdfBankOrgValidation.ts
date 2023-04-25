import { PassThrough } from "stream";
import SHACLValidator from "rdf-validate-shacl";
import factory from "rdf-ext";
import DatasetExt from "rdf-ext/lib/Dataset";
import { loadN3DataSetfromString } from "../../utils/loadN3DataSet";
import { Logger } from "pino";


class StreamRdfBankOrgValidation extends PassThrough {
    private organizationSchema: DatasetExt;
    private validator: SHACLValidator;
    private logger: Logger;
    
    constructor(organizationSchema: DatasetExt, logger: Logger) {
        super({ objectMode: true });
        this.organizationSchema = organizationSchema;
        this.validator = new SHACLValidator(this.organizationSchema, { factory });
        this.logger = logger;
    }

    _write(data: string, encoding: string, callback: Function) {
        this.logger.info("Validating the following data: ");
        loadN3DataSetfromString(data)
        .then((dataN3: DatasetExt) => {
            this.logger.info("Data loaded into N3 dataset:");
            const report = this.validator.validate(dataN3);
            if (report.conforms) {
                this.logger.info("Validation passed for the following data: ");
                this.push(data);
            }
            else {
                this.logger.error("Validation failed for the following data: ");
                this.logger.error(data);
                this.logger.error("Validation report: ");
                this.logger.error(report);
            }
            callback();
        })
        .catch((error: any) => {
            this.logger.error(error);
            callback();
        });
    }

    // When all the data is done passing, it stops.
    _final() {
        this.push(null);
    }
}

export { StreamRdfBankOrgValidation }