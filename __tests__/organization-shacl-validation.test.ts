import SHACLValidator from 'rdf-validate-shacl';
import { loadN3DataSet } from '../src/utils/loadN3DataSet';
import factory from 'rdf-ext';

describe("Stupid Test That should pass!", () => {
  test("Validate Static organization example against organization shape", async () => {
    const shapes = await loadN3DataSet('rdf/ontology/bank-organization.ttl');
    const data = await loadN3DataSet('rdf/data/bank-organization-example.ttl');
    const validator = new SHACLValidator(shapes, { factory });
    const report = await validator.validate(data);
    expect(report.conforms).toBe(true);
  });
});
