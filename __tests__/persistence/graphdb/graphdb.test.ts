import { Employee } from "../../../src/models/eom/Employee";
import { BankOrgRdfDataGenerator } from "../../../src/rdf-generators/BankOrgRdfDataGenerator";
import { OnToTextGraphDB } from "../../../src/persistence/graphdb/OnToTextGraphDB";

describe("GraphDB IRdfGraph interface testing", () => {
    test("Load single employee turtle and retreive", async () => {
        const graphDB: OnToTextGraphDB =  new OnToTextGraphDB();
        // await graphDB.init();
        const employeeRecord : Employee = new Employee("4041234", "A041234", "John", "Hawkins", "A", "Staff",
            new Date("2012-01-01"),
            new Date("2012-12-31"),
            new Date("2009-11-02"),
            new Date("9999-12-31"));

        var turtleData: string = "";
        await BankOrgRdfDataGenerator(employeeRecord)
        .then((result) => {
            turtleData = result;
        })
        .catch((error) => {
            console.log(error);
        });

        await graphDB.turtleUpdate(turtleData)
                .then((res) => {
                    console.log("inserted a class :\n" + JSON.stringify(turtleData, null, 2));
                })
                .catch((err) => {
                    console.log(err);
                });
           
        graphDB.destroy();
    });
});