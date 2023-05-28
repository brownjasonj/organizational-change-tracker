import 'reflect-metadata';
import { sparqlEmployeeByEmployeeIdQuery } from "../../../../../src/rdf/sparql/idqueries/sparqlEmployeeByEmployeeIdQuery";
import { defaultedPrefixes, RdfOntologyConfiguration } from '../../../../models/eom/configuration/RdfOntologyConfiguration';

describe("sparqlEmployeeByEmployeeIdQuery test", () => {
  let rdfOntologyDefinitions = plainToClass(RdfOntologyConfiguration, { prefixes: defaultedPrefixes});

  test("Returns valid query string", async () => {
    const employeeId: string = "123456789";
    const query = sparqlEmployeeByEmployeeIdQuery(employeeId);
    expect(query).toContain(employeeId);
  });
});
