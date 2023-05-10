import 'reflect-metadata';
import { sparqlEmployeeByEmployeeIdQuery } from "../../../../../src/rdf/sparql/idqueries/sparqlEmployeeByEmployeeIdQuery";

describe("sparqlEmployeeByEmployeeIdQuery test", () => {
  test("Returns valid query string", async () => {
    const employeeId: string = "123456789";
    const query = sparqlEmployeeByEmployeeIdQuery(employeeId);
    expect(query).toContain(employeeId);
  });
});
