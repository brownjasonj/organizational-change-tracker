import { plainToClass } from 'class-transformer';
import 'reflect-metadata';
import { sparqlTimeByTimeIdQuery } from '../../../../../src/rdf/sparql/idqueries/sparqlTimeByTimeIdQuery';
import { defaultedPrefixes, RdfOntologyConfiguration } from '../../../../models/eom/configuration/RdfOntologyConfiguration';

describe("sparqlTimeByTimeIdQuery test", () => {
  let rdfOntologyDefinitions = plainToClass(RdfOntologyConfiguration, { prefixes: defaultedPrefixes});

  test("Returns valid query string", async () => {
    const timeId: string = "123456789";
    const query = sparqlTimeByTimeIdQuery(rdfOntologyDefinitions, timeId);
    expect(query).toContain(timeId);
  });
});
