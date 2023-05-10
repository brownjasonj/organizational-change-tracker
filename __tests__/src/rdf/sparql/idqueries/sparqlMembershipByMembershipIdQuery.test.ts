import 'reflect-metadata';
import { sparqlMembershipByMembershipIdQuery } from '../../../../../src/rdf/sparql/idqueries/sparqlMembershipByMembershipIdQuery';

describe("sparqlMembershipByMembershipIdQuery test", () => {
  test("Returns valid query string", async () => {
    const membershipId: string = "123456789";
    const query = sparqlMembershipByMembershipIdQuery(membershipId);
    expect(query).toContain(membershipId);
  });
});

