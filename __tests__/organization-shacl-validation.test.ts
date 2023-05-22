import SHACLValidator from 'rdf-validate-shacl';
import fs from 'fs';
import ParserN3 from '@rdfjs/parser-n3';
import factory from 'rdf-ext';
import 'reflect-metadata';
import { Employee } from "../src/models/eom/Employee";
import { BankOrgRdfDataGenerator } from "../src/rdf/generators/BankOrgRdfDataGenerator";

describe("Stupid Test That should pass!", () => {
  test("Validate Static organization example against organization shape", async () => {
    const parser = new ParserN3({ factory })
    const shapes = await factory.dataset().import(parser.import(fs.createReadStream('rdf/ontology/bank-organization.ttl')));
    const data = await factory.dataset().import(parser.import(fs.createReadStream('rdf/data/bank-organization-example.ttl')));
    const validator = new SHACLValidator(shapes, { factory });
    const report = await validator.validate(data);
    console.log(`Report: ${report.conforms}`);
    expect(report.conforms).toBe(true);
  });

  test("Validate RDF organization generator satisfies bank organization ontology", async () => {
    const parser = new ParserN3({ factory })    
    const shapes = await factory.dataset().import(parser.import(fs.createReadStream('rdf/ontology/bank-organization.ttl')));
    const employeeRecord : Employee = new Employee("4041234", "A041234", "John", "Hawkins", "A", "Staff",
                                                            new Date("2012-01-01"),
                                                            new Date("2012-12-31"),
                                                            new Date("2009-11-02"),
                                                          new Date("9999-12-31"));
    console.log(employeeRecord);
    // generate the RDF from the employee record
    const employeeRDFString = await BankOrgRdfDataGenerator(employeeRecord);
    const data = await factory.dataset().import(parser.import(fs.createReadStream(employeeRDFString)));
    console.log(employeeRDFString);
    const validator = new SHACLValidator(shapes, { factory });
    const report = validator.validate(data);
    console.log(`Report: ${report.conforms}`);
    expect(report.conforms).toBe(true);
  });

});
