import { session } from "neo4j-driver";
import { Driver } from "neo4j-driver-core";
import { abort } from "process";
import { Employee } from "../models/eom/Employee";

const addEmployeeRecordCypher: string = 
    'merge (e: Employee {id: $id}) \
     merge (j: JobTitle {title: $jobTitle}) \
     merge (d: Department {name: $department}) \
     merge (e)-[works_in: works_in]->(d) \
     merge (e)-[has_job_title: has_job_title]->(j) \
     on create set e.name = $id, \
                e.firstName = $firstName, \
                e.secondName = $secondName, \
                e.startDate = $startDate, \
                e.endDate = $endDate, \
                e.last_updated = timestamp(),\
                d.title = $department, \
                d.name = $department, \
                d.last_updated = timestamp(), \
                d.startDate = $startDate, \
                works_in.last_updated = timestamp(), \
                works_in.startDate = $startDate, \
                has_job_title.last_updated = timestamp(), \
                has_job_title.startDate = $startDate \
     on match set e.last_updated = timestamp(), \
                d.last_updated = timestamp(), \
                works_in.last_updated = timestamp(), \
                has_job_title.last_updated = timestamp() \
     return e';

async function neo4jAddEmployeeRecord(driver: Driver, employeeRecord: Employee) : Promise<any> {
    const session = driver.session();
    try {
        const result = await session.run(addEmployeeRecordCypher, {
            id: employeeRecord.employee_id,
            firstName: employeeRecord.firstName,
            secondName: employeeRecord.secondName,
            department: employeeRecord.department,
            jobTitle: employeeRecord.jobTitle,
            startDate: employeeRecord.departmentStartDate.toISOString(),
            endDate: employeeRecord.departmentEndDate.toISOString()
        });
        console.log(result.records[0].get(0));
        return result.records;
    } catch (error) {
        console.log(error);
    }
    finally{
        await session.close();
    }
}

export default neo4jAddEmployeeRecord;