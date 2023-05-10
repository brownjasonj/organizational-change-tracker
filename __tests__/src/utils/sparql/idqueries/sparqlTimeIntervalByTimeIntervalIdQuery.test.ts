import 'reflect-metadata';
import { sparqlTimeIntervalByTimeIntervalId } from '../../../../../src/rdf/sparql/idqueries/sparqlTimeIntervalByTimeIntervalIdQuery';

describe("sparqlTimeIntervalByTimeIntervalId test", () => {
  test("Returns valid query string", async () => {
    const timeIntervalId: string = "123456789";
    const query = sparqlTimeIntervalByTimeIntervalId(timeIntervalId);
    expect(query).toContain(timeIntervalId);
  });
});
