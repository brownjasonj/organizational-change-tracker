import { EmployeeCountByDepartmentTimeEpoc } from "../models/eom/EmployeeCountByDepartmentTimeEpoc";
import { Employee } from "../models/eom/Employee";
import { IRdfGraphDB, SparqlQueryResultType } from "../persistence/IRdfGraphDB";
import { IOrganizationRdfQuery } from "./IOrganizationRdfQuery";
import { DepartmentTimeSeries } from "../models/eom/DepartmentTimeSeries";
import { sparqlDepartmentHistoryQuery } from "./sparql/sparqlDepartmentHistoryQuery";
import { sparqlJoinersQueryByDepartment } from "./sparql/sparqlDepartmentJoinersQuery";
import { EmployeeLeaverJoiner, EmployeeLeaverJoinerType } from "../models/eom/EmployeeLeaverJoiner";
import { sparqlLeaversQueryByDepartment } from "./sparql/sparqlDepartmentLeaversQuery";
import { sparqlEmployeeDepartmentHistoryQuery } from "./sparql/sparqlEmployeeDepartmentHistoryQuery";
import { EmployeeDepartmentEpoc } from "../models/eom/EmployeeDepartmentEpoc";
import { EmployeeDepartmentEpocs } from "../models/eom/EmployeeDepartmentEpocs";

abstract class RdfCompliantBackend implements IOrganizationRdfQuery {
    private graphDB: IRdfGraphDB;

    constructor(graphDB: IRdfGraphDB) {
        this.graphDB = graphDB;
    }

    createBankOrgRdfDataGenerator(employee: Employee): Promise<string> {
        throw new Error("Method not implemented.");
    }

    deleteAllTriple(): Promise<any> {
        return this.graphDB.deleteAllTriple();
    }

    getDepartmentCodes(asOfDate: Date): string {
        throw new Error("Method not implemented.");
    }

    getDepartmentHistory(departmentCode: string, startDate: Date, endDate: Date, dateStep: number): Promise<DepartmentTimeSeries> {
        return new Promise<DepartmentTimeSeries>(async (resolve, reject) => {
            const timeseries: DepartmentTimeSeries = new DepartmentTimeSeries(departmentCode, startDate, endDate, dateStep);
            const stepTime = (1000*60*60*24 * dateStep);
            for(var currentDate: Date = startDate; currentDate <= endDate; currentDate = new Date(currentDate.getTime() + stepTime)) {
                try {
                    console.log(`Calling getSparqlQuery for ${departmentCode} on ${currentDate}`);
                    const result:EmployeeCountByDepartmentTimeEpoc = await this.getEmployeeCountByDepartmentCode(departmentCode, currentDate);
                    const previousPeriod = new Date(currentDate.getTime() - stepTime);
                    const joiners: EmployeeLeaverJoiner[] = await this.getDepartmentJoiners(departmentCode, previousPeriod, new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59));
                    const leavers: EmployeeLeaverJoiner[] = await this.getDepartmentLeavers(departmentCode, previousPeriod, new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59));
                    result.joiners = joiners;
                    result.leavers = leavers;
                    console.log(result);
                    timeseries.addPoint(result);
                }
                catch (error) {
                    console.log(error);
                    reject(error);
                }
            }
            resolve(timeseries);
        });
    }

    getDepartmentJoiners(departmentCode: string, startDate: Date, endDate: Date): Promise<EmployeeLeaverJoiner[]> {
        return new Promise<EmployeeLeaverJoiner[]>(async (resolve, reject) => {
            const sparqlQuery = sparqlJoinersQueryByDepartment(departmentCode, startDate, endDate);
            var joinerSet: EmployeeLeaverJoiner[] = [];
            this.graphDB.sparqlQuery(sparqlQuery, SparqlQueryResultType.JSON)
            .then((result) => {
                console.log(result);
                for(var joiner of result.results.bindings) {
                    console.log(joiner);
                    joinerSet.push(new EmployeeLeaverJoiner(joiner.pid.value, joiner.department.value, joiner.startingDate.value, EmployeeLeaverJoinerType.JOINER));
                }
                resolve(joinerSet);
            })
            .catch((error) => {
                console.log(error);
                return reject(error);
            });
        });
    }

    getDepartmentLeavers(departmentCode: string, startDate: Date, endDate: Date): Promise<EmployeeLeaverJoiner[]> {
        return new Promise<EmployeeLeaverJoiner[]>(async (resolve, reject) => {
            const sparqlQuery = sparqlLeaversQueryByDepartment(departmentCode, startDate, endDate);
            var joinerSet: EmployeeLeaverJoiner[] = [];
            this.graphDB.sparqlQuery(sparqlQuery, SparqlQueryResultType.JSON)
            .then((result) => {
                console.log(result);
                for(var joiner of result.results.bindings) {
                    console.log(joiner);
                    joinerSet.push(new EmployeeLeaverJoiner(joiner.pid.value, joiner.department.value, joiner.endingDate.value, EmployeeLeaverJoinerType.LEAVER));
                }
                resolve(joinerSet);
            })
            .catch((error) => {
                console.log(error);
                return reject(error);
            });
        });
    }

    getEmployeeCountByDepartmentCode(departmentCode: string, asOfDate: Date): Promise<EmployeeCountByDepartmentTimeEpoc> {
        const sparqlQuery = sparqlDepartmentHistoryQuery(departmentCode, asOfDate, new Date(asOfDate.getFullYear(), asOfDate.getMonth(), asOfDate.getDate(), 23, 59, 59))
        console.log(sparqlQuery);
        return new Promise((resolve, reject) => {
            this.graphDB.sparqlQuery(sparqlQuery, SparqlQueryResultType.JSON)
            .then((result) => {
                console.log(result);
                if (result.results.bindings.length > 0)
                    resolve(new EmployeeCountByDepartmentTimeEpoc(departmentCode, asOfDate, result.results.bindings[0].count.value));
                else 
                    resolve(new EmployeeCountByDepartmentTimeEpoc(departmentCode, asOfDate, 0));
            })
            .catch((error) => {
                console.log(error);
                return reject(error);
            });
        });
    }

    getEmployeeDepartmentHistory(): Promise<EmployeeDepartmentEpocs[]> {
        return new Promise((resolve, reject) => {
            const sparqlQuery = sparqlEmployeeDepartmentHistoryQuery();
            const employeeDepartmentEpocs = new Map<string, EmployeeDepartmentEpocs>();
            this.graphDB.sparqlQuery(sparqlQuery, SparqlQueryResultType.JSON)
            .then((result) => {
                console.log(result);
                result.results.bindings.forEach((binding: any) => {
                    const employeeId = binding.pid.value;
                    const department = binding.department.value;
                    const startDate = new Date(binding.startDate.value.split("^^")[0]).toUTCString();
                    const endDate = new Date(binding.endDate.value.split("^^")[0]).toUTCString();
                    const epoc = new EmployeeDepartmentEpoc(employeeId, department, startDate, endDate);
                    if (employeeDepartmentEpocs.has(employeeId)) {
                        employeeDepartmentEpocs.get(employeeId)!.addEpoc(epoc);
                    } else {
                        const employeeDepartmentEpoc = new EmployeeDepartmentEpocs(employeeId);
                        employeeDepartmentEpoc.addEpoc(epoc);
                        employeeDepartmentEpocs.set(employeeId, employeeDepartmentEpoc);
                    }
                });
                return resolve(Array.from(employeeDepartmentEpocs, ([name, value]) => value));
            })
            .catch((error: any) => {
                console.log(error);
                return reject(error);
            });
        });
    }
    
    sparqlRoleHistoryQuery(employeeId: string): string {
        throw new Error("Method not implemented.");
    }
}

export { RdfCompliantBackend }