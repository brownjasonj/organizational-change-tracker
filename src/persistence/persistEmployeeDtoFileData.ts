import { xml2json } from "xml-js";
import { IRdfGraphDB } from "../interfaces/IRdfGraphDB";
import { EmployeeDto } from "../models/dto/EmployeeDto";
import { Employee } from "../models/eom/Employee";
import { employeeDtoToEmployee } from "../models/mappers/EmployeeMapper";
import organizationaRdfGenerator from "../rdf-generators/OrganizationRdfGenerator";
import { processFileStreamAsJson } from "../utils/processFileStreamAsJson";

const persistEmployeeDtoFileData = async (graphDB: IRdfGraphDB, filePath: string) => {
    const retryList: Employee[] = [];
    processFileStreamAsJson(filePath, (data: any) => {
        const employeeDto: EmployeeDto = data as EmployeeDto;
        const employeeRecord: Employee = employeeDtoToEmployee(employeeDto);
        organizationaRdfGenerator(employeeRecord)
        .then((result) => {
            graphDB.turtleUpdate(result)
                .then((res) => {
                    console.log(res);
                })
            .catch((err) => {
                console.log(`Error: ${err.message}.  Pushing to retry list.`);
                retryList.push(employeeRecord);
            })
        })
        .catch((error) => {
            console.log(error);
        });

        // try again
        while (retryList.length > 0) {
            console.log('retrying...');
            const employeeRecord: Employee = retryList.pop()!;
            organizationaRdfGenerator(employeeRecord)
            .then((result) => {
                graphDB.turtleUpdate(result)
                    .then((res) => {
                    console.log(xml2json(res))
                    })
                .catch((err) => {
                    console.log(err);
                    retryList.push(employeeRecord);
                })
            })
            .catch((error) => {
                console.log(error);
            });
        }

    }).then(() => {
        console.log("Done");
    })
    .catch((error) => {
    });
}

export { persistEmployeeDtoFileData }