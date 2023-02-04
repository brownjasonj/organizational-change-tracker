import { Employee } from "../../../src/models/eom/Employee";
import { BankOrgRdfDataGenerator } from "../../../src/rdf-generators/BankOrgRdfDataGenerator";
import { IRdfGraphDB } from "../../../src/interfaces/IRdfGraphDB";
import { GraphDB } from "../../../src/persistence/graphdb/GraphDB";
import { GenerateBankOrgRdfTriples } from "../../../src/rdf-generators/GenerateBankOrgRdfTripes";
import { xml2json } from "xml-js";



describe("GraphDB IRdfGraph interface testing", () => {
    test("Load single employee turtle and retreive", async () => {
        const graphDB: GraphDB =  new GraphDB();
        await graphDB.init();
        const employeeRecord : Employee = new Employee("4041234", "A041234", "John", "Hawkins", "A", "Staff",
            new Date("2012-01-01"),
            new Date("2012-12-31"),
            new Date("2009-11-02"),
            new Date("9999-12-31"));

    //     const triples = GenerateBankOrgRdfTriples(employeeRecord);
    //     console.log(triples);

    //     await graphDB.turtleUpdate(`insert data {
    //         @prefix bank-org: <http://example.org/bank-org#>.
    //   @prefix bank-id: <http://example.org/bank-id#>.
    //   @prefix foaf: <http://xmlns.com/foaf/0.1#>.
    //   @prefix org: <http://www.w3.org/ns/org#>.
    //   @prefix time: <http://www.w3.org/2006/time#>.
    //   @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
    //   @prefix rdfs: <http://www.w3.org/2001/XMLSchema#>.
    //   @prefix xsd: <http://www.w3.org/2000/01/rdf-schema#>.
      
    //   bank-id:4041234 a bank-org:BankEmployee;
    //       bank-id:id "4041234";
    //       bank-id:pid "A041234";
    //       foaf:firstName "John";
    //       foaf:surname "Hawkins".
    //     }`)
    //     .then((result) => {
    //         console.log("inserted a class :\n" + JSON.stringify(result, null, 2));
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });
        BankOrgRdfDataGenerator(employeeRecord)
        .then((result) => {
            graphDB.turtleUpdate(result)
                .then((res) => {
                    console.log("inserted a class :\n" + JSON.stringify(result, null, 2));
                })
                .catch((err) => console.log(err));
                })
        .catch((error) => {
            console.log(error);
        });
    });
});