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
import { Logger } from "pino";
import { sparqlCorporateTitleHistoryByEmployeeIdQuery } from "./sparql/sparqlCorporateTitleHistoryByEmployeeIdQuery";
import { sparqlEmployeeDepartmentHistoryQueryByEmployeeId } from "./sparql/sparqlEmployeeDepartmentHistoryByEmployeeIdQuery";
import { EmployeeCorporateTitleEpocs } from "../models/eom/EmployeeCorporateTitleEpocs";
import { EmployeeCorporateTitleEpoc } from "../models/eom/EmployeeCorporateTitleEpoc";

abstract class RdfCompliantBackend implements IOrganizationRdfQuery {
    private graphDB: IRdfGraphDB;
    private logger: Logger;

    constructor(graphDB: IRdfGraphDB, logger: Logger) {
        this.graphDB = graphDB;
        this.logger = logger;
    }

    createBankOrgRdfDataGenerator(employee: Employee): Promise<string> {
        this.logger.error("createBankOrgRdfDataGenerator not implemented.");
        throw new Error("Method not implemented.");
    }

    deleteAllTriple(): Promise<any> {
        return this.graphDB.deleteAllTriple();
    }

    getDepartmentCodes(asOfDate: Date): Promise<string> {
        this.logger.error("getDepartmentCodes not implemented.");
        throw new Error("Method not implemented.");
    }

    getDepartmentHistory(departmentCode: string, startDate: Date, endDate: Date, dateStep: number): Promise<DepartmentTimeSeries> {
        this.logger.info(`getDepartmentHistory(${departmentCode}, ${startDate}, ${endDate}, ${dateStep}).`);
        return new Promise<DepartmentTimeSeries>(async (resolve, reject) => {
            const timeseries: DepartmentTimeSeries = new DepartmentTimeSeries(departmentCode, startDate, endDate, dateStep);
            const stepTime = (1000*60*60*24 * dateStep);
            for(var currentDate: Date = startDate; currentDate <= endDate; currentDate = new Date(currentDate.getTime() + stepTime)) {
                try {
                    this.logger.info(`Calling getSparqlQuery for ${departmentCode} on ${currentDate}`);
                    const result:EmployeeCountByDepartmentTimeEpoc = await this.getEmployeeCountByDepartmentCode(departmentCode, currentDate);
                    const previousPeriod = new Date(currentDate.getTime() - stepTime);
                    var joiners: EmployeeLeaverJoiner[] = await this.getDepartmentJoiners(departmentCode, previousPeriod, new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59));
                    var leavers: EmployeeLeaverJoiner[] = await this.getDepartmentLeavers(departmentCode, previousPeriod, new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59));

                    // check the Joiners/Leavers list.  It is possible that the original data has entires with an employee having and end date
                    // and start date on the same day.  This will cause the joiner/leaver to be counted twice.  So we need to remove them.
                    for(var joiner of joiners) {
                        for(var leaver of leavers) {
                            if(joiner.pid == leaver.pid) {
                                this.logger.info(`Removing joiner/leaver ${joiner.pid} from joiner/leaver list.  Joiner: ${joiner.date} Leaver: ${leaver.date}`);
                                joiners = joiners.filter((j) => j.pid != joiner.pid);
                                leavers = leavers.filter((l) => l.pid != leaver.pid);
                            }
                        }
                    }
                    result.joiners = joiners;
                    result.leavers = leavers;
                    this.logger.info(result);
                    timeseries.addPoint(result);
                }
                catch (error) {
                    this.logger.error(error);
                    reject(error);
                }
            }
            resolve(timeseries);
        });
    }

    getDepartmentJoiners(departmentCode: string, startDate: Date, endDate: Date): Promise<EmployeeLeaverJoiner[]> {
        this.logger.info(`getDepartmentJoiners(${departmentCode}, ${startDate}, ${endDate}).`);
        return new Promise<EmployeeLeaverJoiner[]>(async (resolve, reject) => {
            const sparqlQuery = sparqlJoinersQueryByDepartment(departmentCode, startDate, endDate);
            var joinerSet: EmployeeLeaverJoiner[] = [];
            this.graphDB.sparqlQuery(sparqlQuery, SparqlQueryResultType.JSON)
            .then((result) => {
                this.logger.info(result);
                for(var joiner of result.results.bindings) {
                    this.logger.info(joiner);
                    joinerSet.push(new EmployeeLeaverJoiner(joiner.pid.value, joiner.department.value, joiner.startingDate.value, EmployeeLeaverJoinerType.JOINER));
                }
                resolve(joinerSet);
            })
            .catch((error) => {
                this.logger.error(error);
                return reject(error);
            });
        });
    }

    getDepartmentLeavers(departmentCode: string, startDate: Date, endDate: Date): Promise<EmployeeLeaverJoiner[]> {
        this.logger.info(`getDepartmentLeavers(${departmentCode}, ${startDate}, ${endDate}).`);
        return new Promise<EmployeeLeaverJoiner[]>(async (resolve, reject) => {
            const sparqlQuery = sparqlLeaversQueryByDepartment(departmentCode, startDate, endDate);
            var joinerSet: EmployeeLeaverJoiner[] = [];
            this.graphDB.sparqlQuery(sparqlQuery, SparqlQueryResultType.JSON)
            .then((result) => {
                this.logger.info(result);
                for(var joiner of result.results.bindings) {
                    this.logger.info(joiner);
                    joinerSet.push(new EmployeeLeaverJoiner(joiner.pid.value, joiner.department.value, joiner.endingDate.value, EmployeeLeaverJoinerType.LEAVER));
                }
                resolve(joinerSet);
            })
            .catch((error) => {
                this.logger.error(error);
                return reject(error);
            });
        });
    }

    getEmployeeCountByDepartmentCode(departmentCode: string, asOfDate: Date): Promise<EmployeeCountByDepartmentTimeEpoc> {
        const sparqlQuery = sparqlDepartmentHistoryQuery(departmentCode, asOfDate, new Date(asOfDate.getFullYear(), asOfDate.getMonth(), asOfDate.getDate(), 23, 59, 59));
        this.logger.info(`getEmployeeCountByDepartmentCode(${departmentCode}, ${asOfDate}).`);
        this.logger.info(`Sparql Query: ${sparqlQuery}`);
        return new Promise((resolve, reject) => {
            this.graphDB.sparqlQuery(sparqlQuery, SparqlQueryResultType.JSON)
            .then((result) => {
                this.logger.info(result);
                if (result.results.bindings.length > 0)
                    resolve(new EmployeeCountByDepartmentTimeEpoc(departmentCode, asOfDate, result.results.bindings[0].count.value));
                else 
                    resolve(new EmployeeCountByDepartmentTimeEpoc(departmentCode, asOfDate, 0));
            })
            .catch((error) => {
                this.logger.error(error);
                return reject(error);
            });
        });
    }

    getEmployeeDepartmentHistory(): Promise<EmployeeDepartmentEpocs[]> {
        this.logger.info(`getEmployeeDepartmentHistory().`);
        return new Promise((resolve, reject) => {
            const sparqlQuery = sparqlEmployeeDepartmentHistoryQuery();
            const employeeDepartmentEpocs = new Map<string, EmployeeDepartmentEpocs>();
            this.graphDB.sparqlQuery(sparqlQuery, SparqlQueryResultType.JSON)
            .then((result) => {
                this.logger.info(result);
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
                this.logger.error(error);
                return reject(error);
            });
        });
    }
    
    getEmployeeDepartmentHistoryByEmployeeId(employeeId: string): Promise<EmployeeDepartmentEpocs> {
        return new Promise<EmployeeDepartmentEpocs>((resolve, reject) => {
            const sparqlQuery = sparqlEmployeeDepartmentHistoryQueryByEmployeeId(employeeId);
            this.graphDB.sparqlQuery(sparqlQuery, SparqlQueryResultType.JSON)
            .then((result) => {
                const employeeDepartmentEpocs = new EmployeeDepartmentEpocs(employeeId);
                this.logger.info(result);
                result.results.bindings.forEach((binding: any) => {
                    const department = binding.department.value;
                    const startDate = new Date(binding.startDate.value.split("^^")[0]).toUTCString();
                    const endDate = new Date(binding.endDate.value.split("^^")[0]).toUTCString();
                    const epoc = new EmployeeDepartmentEpoc(employeeId, department, startDate, endDate);
                    employeeDepartmentEpocs.addEpoc(epoc);
                });
                return resolve(employeeDepartmentEpocs);
            })
            .catch((error: any) => {
                this.logger.error(error);
                return reject(error);
            });
        });
    }

    getEmployeeCorporateTitleHistoryByEmployeeId(employeeId: string): Promise<EmployeeCorporateTitleEpocs> {
        return new Promise<EmployeeCorporateTitleEpocs>((resolve, reject) => {
            const sparqlQuery = sparqlCorporateTitleHistoryByEmployeeIdQuery(employeeId);
            this.graphDB.sparqlQuery(sparqlQuery, SparqlQueryResultType.JSON)
            .then((result) => {
                const employeeCorporateTitleEpocs = new EmployeeCorporateTitleEpocs(employeeId);
                this.logger.info(result);
                result.results.bindings.forEach((binding: any) => {
                    const corporateTitle = binding.corpTitle.value;
                    const startDate = new Date(binding.startDate.value.split("^^")[0]).toUTCString();
                    const endDate = new Date(binding.endDate.value.split("^^")[0]).toUTCString();
                    const epoc = new EmployeeCorporateTitleEpoc(employeeId, corporateTitle, startDate, endDate);
                    employeeCorporateTitleEpocs.addEpoc(epoc);
                });
                return resolve(employeeCorporateTitleEpocs);
            })
            .catch((error) => {
                this.logger.error(error);
                return reject(error);
            });
        });

    }
}

export { RdfCompliantBackend }