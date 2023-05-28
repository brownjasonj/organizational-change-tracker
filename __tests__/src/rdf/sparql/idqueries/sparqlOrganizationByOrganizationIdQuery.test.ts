import { plainToClass } from 'class-transformer';
import 'reflect-metadata';
import { sparqlOrganizationByOrganizationIdQuery } from '../../../../../src/rdf/sparql/idqueries/sparqlOrganizationByOrganizationIdQuery';
import { defaultedPrefixes, RdfOntologyConfiguration } from '../../../../models/eom/configuration/RdfOntologyConfiguration';

describe("sparqlOrganizationByOrganizationIdQuery test", () => {
  let rdfOntologyDefinitions = plainToClass(RdfOntologyConfiguration, { prefixes: defaultedPrefixes});

  test("Returns valid query string", async () => {
    const organizationId: string = "123456789";
    const query = sparqlOrganizationByOrganizationIdQuery(rdfOntologyDefinitions, organizationId);
    expect(query).toContain(organizationId);
  });
});
