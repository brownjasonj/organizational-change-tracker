import factory from 'rdf-ext';
import SHACLValidator from 'rdf-validate-shacl';
import { loadN3DataSet } from '../src/utils/loadN3DataSet';

describe("Stupid Test That should pass!", () => {
  test("Validate Static organization example against organization shape", async () => {
    const shapes = await loadN3DataSet('src/__tests__/organization-shape.ttl');
    const data = await loadN3DataSet('src/__tests__/organization.ttl');
    const validator = new SHACLValidator(shapes, { factory });
    const report = await validator.validate(data);
    expect(report.conforms).toBe(true)
  });
});
