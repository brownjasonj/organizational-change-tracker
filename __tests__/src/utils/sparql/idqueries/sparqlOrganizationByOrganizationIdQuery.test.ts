import 'reflect-metadata';
import { sparqlOrganizationByOrganizationIdQuery } from '../../../../../src/rdf/sparql/idqueries/sparqlOrganizationByOrganizationIdQuery';

describe("sparqlOrganizationByOrganizationIdQuery test", () => {
  test("Returns valid query string", async () => {
    const organizationId: string = "123456789";
    const query = sparqlOrganizationByOrganizationIdQuery(organizationId);
    expect(query).toContain(organizationId);
  });
});
