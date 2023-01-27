import SHACLValidator from 'rdf-validate-shacl';
import { loadN3DataSetfromFile, loadN3DataSetfromString } from '../src/utils/loadN3DataSet';
import factory from 'rdf-ext';
import { Employee } from "../src/models/eom/Employee";
import { BankOrgRdfDataGenerator } from "../src/rdf-generators/BankOrgRdfDataGenerator";

describe("Stupid Test That should pass!", () => {
  test("Validate Static organization example against organization shape", async () => {
    const shapes = await loadN3DataSetfromFile('rdf/ontology/bank-organization.ttl');
    const data = await loadN3DataSetfromFile('rdf/data/bank-organization-example.ttl');
    const validator = new SHACLValidator(shapes, { factory });
    const report = await validator.validate(data);
    console.log(`Report: ${report.conforms}`);
    expect(report.conforms).toBe(true);
  });

  // test("Validate RDF organization generator satisfies bank organization ontology", async () => {
    
  //   const employeeRecord : Employee = new Employee("01", "01", "John", "Hawkins", "A", "Staff",
  //                                                           new Date("2012-01-01"),
  //                                                           new Date("2012-12-31"),
  //                                                           new Date("2009-11-02"),
  //                                                         new Date("9999-12-31"));
  //   console.log(employeeRecord);
  //   // generate the RDF from the employee record
  //   organizationaRdfGenerator(employeeRecord).then(async (employeeRdfString) => {
  //     // load the ontology for which the RDF should be validated against
  //     loadN3DataSetfromFile('rdf/ontology/bank-organization.ttl').then((shapes) => {
  //       // load the N3 w
  //       loadN3DataSetfromString(employeeRdfString).then((data) => {
  //         const validator = new SHACLValidator(shapes, { factory });
  //         const report = validator.validate(data);
  //         expect(report.conforms).toBe(true);
  //       }).catch((error) => {
  //         // There is a problem witth loading the data from the string
  //       });
  //     }).catch((error) => {
  //       // there is a problem loading the ontology file!
  //     });
  //   }).catch((error) => {
  //     // There is a problem with the RDF generator
  //   });
  // });


  test("Validate RDF organization generator satisfies bank organization ontology", async () => {
    
    const employeeRecord : Employee = new Employee("4041234", "A041234", "John", "Hawkins", "A", "Staff",
                                                            new Date("2012-01-01"),
                                                            new Date("2012-12-31"),
                                                            new Date("2009-11-02"),
                                                          new Date("9999-12-31"));
    console.log(employeeRecord);
    // generate the RDF from the employee record
    const employeeRDFString = await BankOrgRdfDataGenerator(employeeRecord);
    const shapes = await loadN3DataSetfromFile('rdf/ontology/bank-organization.ttl');
    const data = await loadN3DataSetfromString(employeeRDFString);
    console.log(employeeRDFString);
    const validator = new SHACLValidator(shapes, { factory });
    const report = validator.validate(data);
    expect(report.conforms).toBe(true);
  });

});
