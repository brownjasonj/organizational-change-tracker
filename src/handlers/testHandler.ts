import { Response } from "express";
import { Context, Handler, Request } from "openapi-backend";
import SHACLValidator from "rdf-validate-shacl";
import { loadN3DataSetfromFile } from "../utils/loadN3DataSet";
import factory from "rdf-ext";

const testHandler = async (context: Context, request: Request, response: Response) => {
        const shapes = await loadN3DataSetfromFile('rdf-examples/bank-organization.ttl');
        const data = await loadN3DataSetfromFile('rdf-examples/bank-organization-example.ttl');
        const validator = new SHACLValidator(shapes, { factory });
        const report = await validator.validate(data);
        console.log(report.conforms);
        for (const result of report.results) {
            // See https://www.w3.org/TR/shacl/#results-validation-result for details
            // about each property
            console.log("###################");
            console.log(result.message.toString());
            console.log(result.path?.toString());
            console.log(result.focusNode?.toString());
            console.log(result.severity?.toString());
            console.log(result.sourceConstraintComponent)
            console.log(result.sourceShape)
            console.log("###################");
          }
        response.json({ message: 'hello world' });
    };

export default testHandler;