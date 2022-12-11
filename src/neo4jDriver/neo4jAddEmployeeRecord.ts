import { session } from "neo4j-driver";
import { Driver } from "neo4j-driver-core";
import EmployeeRecord from "../models/EmployeeRecord";

const addEmployeeRecordCypher: string = 
    'merge (e: Employee {id: $id}) \
     on create set e.firstName = $firstName, \
                e.secondName = $secondName,\
                e.department = $department,\
                e.jobTitle = $jobTitle,\
                e.startDate = $startDate,\
                e.endDate = $endDate, \
                e.last_updated = timestamp() \
     on match set e.last_updated = timestamp() \
     return e';

async function neo4jAddEmployeeRecord(driver: Driver, employeeRecord: EmployeeRecord) : Promise<any> {
    const session = driver.session();
    try {
        const result = await session.run(addEmployeeRecordCypher, {
            id: employeeRecord.id,
            firstName: employeeRecord.firstName,
            secondName: employeeRecord.secondName,
            department: employeeRecord.department,
            jobTitle: employeeRecord.jobTitle,
            startDate: employeeRecord.startDate.toISOString(),
            endDate: employeeRecord.endDate.toISOString()
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