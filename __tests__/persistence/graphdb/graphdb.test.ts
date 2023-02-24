import { Employee } from "../../../src/models/eom/Employee";
import { BankOrgRdfDataGenerator } from "../../../src/rdf/generators/BankOrgRdfDataGenerator";
import { GraphPersistenceFactory } from "../../../src/persistence/GraphPersistenceFactory";
import { IRdfGraphDB } from "../../../src/persistence/IRdfGraphDB";

describe("GraphDB IRdfGraph interface testing", () => {
    test("Load single employee turtle and retreive", async () => {
        const graphDB: IRdfGraphDB =  GraphPersistenceFactory.getGraphDB();
        // await graphDB.init();
        const employeeRecord : Employee = new Employee("4041234", "A041234", "John", "Hawkins", "A", "Staff",
            new Date("2012-01-01"),
            new Date("2012-12-31"),
            new Date("2009-11-02"),
            new Date("9999-12-31"));

        const turtleData: string = await BankOrgRdfDataGenerator(employeeRecord);
        expect(turtleData).toBeDefined();
        const insertResponse = await graphDB.turtleUpdate(turtleData);
        expect(insertResponse).toBeDefined();
    });
});