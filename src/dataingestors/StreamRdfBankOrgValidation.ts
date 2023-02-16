import { PassThrough } from "stream";
import { loadN3DataSetfromFile, loadN3DataSetfromString, syncLoadN3DataSetfromFile } from "../utils/loadN3DataSet";
import SHACLValidator from "rdf-validate-shacl";
import factory from "rdf-ext";
import DatasetExt from "rdf-ext/lib/Dataset";


class StreamRdfBankOrgValidation extends PassThrough {
    private organizationSchema: DatasetExt;
    private validator: SHACLValidator;
    constructor(organizationSchema: DatasetExt) {
        super({ objectMode: true });
        this.organizationSchema = organizationSchema;
        this.validator = new SHACLValidator(this.organizationSchema, { factory });
    }

    _write(data: string, encoding: string, callback: Function) {
        console.log("Validating the following data: ");
        loadN3DataSetfromString(data)
        .then((dataN3: DatasetExt) => {
            console.log("Data loaded into N3 dataset:");
            const report = this.validator.validate(dataN3);
            if (report.conforms) {
                console.log("Validation passed for the following data: ");
                this.push(data);
            }
            else {
                console.log("Validation failed for the following data: ");
                console.log(data);
                console.log("Validation report: ");
                console.log(report);
            }
            callback();
        })
        .catch((error: any) => {
            console.log(error);
            callback();
        });
    }

    // When all the data is done passing, it stops.
    _final() {
        this.push(null);
    }
}

export { StreamRdfBankOrgValidation }