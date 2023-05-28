import { plainToClass } from 'class-transformer';
import 'reflect-metadata';
import { sparqlMembershipByMembershipIdQuery } from '../../../../../src/rdf/sparql/idqueries/sparqlMembershipByMembershipIdQuery';
import { defaultedPrefixes, RdfOntologyConfiguration } from '../../../../models/eom/configuration/RdfOntologyConfiguration';

describe("sparqlMembershipByMembershipIdQuery test", () => {
  let rdfOntologyDefinitions = plainToClass(RdfOntologyConfiguration, { prefixes: defaultedPrefixes});

  test("Returns valid query string", async () => {
    const membershipId: string = "123456789";
    const query = sparqlMembershipByMembershipIdQuery(rdfOntologyDefinitions, membershipId);
    expect(query).toContain(membershipId);
  });
});

