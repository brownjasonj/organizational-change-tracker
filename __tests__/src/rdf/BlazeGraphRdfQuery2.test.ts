import { ChildProcess, exec, spawn } from "child_process"
import { IRdfGraphDB } from "../../../src/persistence/IRdfGraphDB";
import 'reflect-metadata';
import { BlazeGraphRdfQuery } from ".../../../src/rdf/BlazeGraphRdfQuery";
import { Employee } from "../../../src/models/eom/Employee";
import { MapEmployeesToBankRdfOntologyTurtle } from "../../../src/rdf/generators/MapEmployeesToBankOrgRdfTurtle";
import { EmployeeDto } from "../../../src/models/dto/EmployeeDto";
import { employeeDtoToEmployee } from "../../../src/models/mappers/EmployeeMapper";
import { readyToStart } from "../persistence/blazegraph/start_blazegraph";

// Employee 1, joins a department 'A' from outside organization on 2000-01-01 and epoc ends on 2000-02-01
// Employee 1, epoc in 'A' continues on 2000-02-02 and leaves on 2000-03-01
// Employee 1, joins in 'B' on 2000-03-02 and leaves on 2000-05-01
// Employee 1, joins in 'C' on 2000-05-02 and leaves on 2010-12-01
// Employee 1, joins in 'A' on 2010-12-02 and leaves on 2011-12-01
// Employee 1, joins in 'A' on 2011-12-02 and leaves on 2012-12-01
//
// Note that the intention is that the first 'A' is different from the second  'A' in that the organization
// has changed overtime and just reused the names!  But we want to be able to distinguish a joiner/leaver
// in this sense.  
// 
describe("create a new blazegraph DB", () => {
    let testDirectory: string;
    let blazegraphSetupProcess: ChildProcess;
    // let blazegraphProcess: ChildProcess;
    let blazegaphRdfQuery: BlazeGraphRdfQuery;
    let graphdb: IRdfGraphDB;

    const employeeRecords : Employee[] = [
        employeeDtoToEmployee(new EmployeeDto("1", "A1", "John", "Hawkins", "A", "Staff", "01.01.2000", "01.02.2000", "01.01.2000","31.12.9999")),
        employeeDtoToEmployee(new EmployeeDto("1", "A1", "John", "Hawkins", "A", "Staff", "02.02.2000", "01.03.2000", "01.01.2000","31.12.9999")),
        employeeDtoToEmployee(new EmployeeDto("1", "A1", "John", "Hawkins", "B", "AVP", "02.03.2000", "01.05.2000", "01.01.2000","31.12.9999")),
        employeeDtoToEmployee(new EmployeeDto("1", "A1", "John", "Hawkins", "C", "VP", "02.05.2000", "01.12.2010", "01.01.2000","31.12.9999"))
        // employeeDtoToEmployee(new EmployeeDto("1", "A1", "John", "Hawkins", "A", "DIR", "02.12.2010", "01.12.2011", "01.01.2000","31.12.9999")),
        // employeeDtoToEmployee(new EmployeeDto("1", "A1", "John", "Hawkins", "A", "MDR", "02.12.2011", "01.12.2012", "01.01.2000","31.12.9999"))
    ];

    beforeAll(() => {
        return new Promise((resolve, reject) => {
            if (readyToStart) {
                readyToStart.then((childprocess) => {
                    blazegraphSetupProcess = childprocess;
                    MapEmployeesToBankRdfOntologyTurtle(employeeRecords).then((turtleData) => {
                        console.log(turtleData);
                        graphdb.turtleUpdate(turtleData).then((insertResponse) => {
                            console.log(insertResponse);
                            resolve(insertResponse);
                        }).catch((err) => {
                            console.log(err);
                            reject(err);
                        });
                    }).catch((err) => {
                        console.log(err);
                        reject(err);
                    });
                        }).catch((err) => {
                    console.log("server not started");
                });
            }
        });
   }, 10000);

    afterAll(() => {
        if (blazegraphSetupProcess.stdout && blazegraphSetupProcess.stderr && blazegraphSetupProcess.stdin) {
            blazegraphSetupProcess.stdin.write('^C');
            blazegraphSetupProcess.stdin.destroy();
            blazegraphSetupProcess.stdout.destroy();
            blazegraphSetupProcess.stderr.destroy();
            blazegraphSetupProcess.kill('SIGINT');
        }
    }, 10000);

    test("0 Joiners in department A, between 1999-01-01 and 1999-12-31", () => {
       return new Promise((resolve, reject) => {     
            blazegaphRdfQuery.getDepartmentJoiners("A", new Date("1999-01-01"), new Date("1999-12-31")).then((employees) => {
                console.log(employees);
                resolve(expect(employees.length).toBe(0));
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
        });
    });
    
    test("1 Joiner, department A, between 2000-01-01 and 2000-02-01", () => {
        return new Promise((resolve, reject) => {     
            blazegaphRdfQuery.getDepartmentJoiners("A", new Date("2000-01-01"), new Date("2000-01-31")).then((employees) => {
                console.log(employees);
                resolve(expect(employees.length).toBe(1));
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
        });
    });

    test("0 Joiner, department A, between 2000-01-02 and 2000-02-01", () => {
        return new Promise((resolve, reject) => {     
            blazegaphRdfQuery.getDepartmentJoiners("A", new Date("2000-01-02"), new Date("2000-01-31")).then((employees) => {
                console.log(employees);
                resolve(expect(employees.length).toBe(0));
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
        });
    });

    test("0 Joiner, department A, between 2000-02-01 and 2000-03-01", () => {
        return new Promise((resolve, reject) => {     
            blazegaphRdfQuery.getDepartmentJoiners("A", new Date("2000-02-01"), new Date("2000-03-01")).then((employees) => {
                console.log(employees);
                resolve(expect(employees.length).toBe(0));
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
        });
    });

    test("0 Leaver, department A, between 2000-01-01 and 2000-02-28", () => {
        return new Promise((resolve, reject) => {     
            blazegaphRdfQuery.getDepartmentLeavers("A", new Date("2000-01-01"), new Date("2000-02-28")).then((employees) => {
                console.log(employees);
                resolve(expect(employees.length).toBe(0));
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
        });
    });

    test("1 Leaver, department A, between 2000-01-01 and 2000-04-01", () => {
        return new Promise((resolve, reject) => {     
            blazegaphRdfQuery.getDepartmentLeavers("A", new Date("2000-02-01"), new Date("2000-04-01")).then((employees) => {
                console.log(employees);
                resolve(expect(employees.length).toBe(1));
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
        });
    });
});