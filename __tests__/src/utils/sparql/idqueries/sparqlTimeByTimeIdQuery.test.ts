import 'reflect-metadata';
import { sparqlTimeByTimeIdQuery } from '../../../../../src/rdf/sparql/idqueries/sparqlTimeByTimeIdQuery';

describe("sparqlTimeByTimeIdQuery test", () => {
  test("Returns valid query string", async () => {
    const timeId: string = "123456789";
    const query = sparqlTimeByTimeIdQuery(timeId);
    expect(query).toContain(timeId);
  });
});
