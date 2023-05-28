import { plainToClass } from 'class-transformer';
import 'reflect-metadata';
import { sparqlTimeIntervalByTimeIntervalId } from '../../../../../src/rdf/sparql/idqueries/sparqlTimeIntervalByTimeIntervalIdQuery';
import { defaultedPrefixes, RdfOntologyConfiguration } from '../../../../models/eom/configuration/RdfOntologyConfiguration';

describe("sparqlTimeIntervalByTimeIntervalId test", () => {
  let rdfOntologyDefinitions = plainToClass(RdfOntologyConfiguration, { prefixes: defaultedPrefixes});

  test("Returns valid query string", async () => {
    const timeIntervalId: string = "123456789";
    const query = sparqlTimeIntervalByTimeIntervalId(rdfOntologyDefinitions, timeIntervalId);
    expect(query).toContain(timeIntervalId);
  });
});
