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
import { DepartmentEmployeeCountTimeEpoc } from "../models/eom/DepartmentEmployeeCountTimeEpoc";
import { DepartmentEmployeeCountTimeSeries } from "../models/eom/DepartmentEmployeeCountTimeSeries";
import { DepartmentEmployeeCountWithJoinersLeaversEpoc } from "../models/eom/DepartmentEmployeeCountWithJoinersLeaversTimeEpoc";
import { DepartmentEmployeeCountWithJoinersLeaversTimeSeries } from "../models/eom/DepartmentEmployeeCountWithJoinersLeaversTimeSeries";
import { Calendar } from "../utils/Calendar";

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


    getDepartmentEmployeeCountHistory(departmentCode: string, startDate: Date, endDate: Date, dateStep: number): Promise<DepartmentEmployeeCountTimeSeries> {
        this.logger.info(`getDepartmentEmployeeCountHistory(${departmentCode}, ${startDate}, ${endDate}, ${dateStep}).`);
        return new Promise<DepartmentEmployeeCountTimeSeries>(async (resolve, reject) => {
            const timeseries: DepartmentEmployeeCountTimeSeries = new DepartmentEmployeeCountTimeSeries(departmentCode, startDate, endDate, dateStep);
            const stepTime = (1000*60*60*24 * dateStep);
            for(var currentDate: Date = startDate; currentDate <= endDate; currentDate = new Date(currentDate.getTime() + stepTime)) {
                try {
                    this.logger.info(`Calling getSparqlQuery for ${departmentCode} on ${currentDate}`);
                    const result:DepartmentEmployeeCountTimeEpoc = await this.getEmployeeCountByDepartmentAsOf(departmentCode, currentDate);
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

    getDepartmentEmployeeHistoryWithJoinersAndLeavers(departmentCode: string, startDate: Date, endDate: Date, dateStep: number): Promise<DepartmentEmployeeCountWithJoinersLeaversTimeSeries> {
        this.logger.info(`getDepartmentHistory(${departmentCode}, ${startDate}, ${endDate}, ${dateStep}).`);
        return new Promise<DepartmentEmployeeCountWithJoinersLeaversTimeSeries>(async (resolve, reject) => {
            const timeseries: DepartmentEmployeeCountWithJoinersLeaversTimeSeries = new DepartmentEmployeeCountWithJoinersLeaversTimeSeries(departmentCode, startDate, endDate, dateStep);
            // const stepTime = (1000*60*60*24 * dateStep);

            var startPeriod = Calendar.getStartOfDay(startDate);
            var endPeriod = Calendar.getEndOfNextDay(startPeriod, dateStep);
            this.logger.info(`startPeriod: ${startPeriod} endPeriod: ${endPeriod}`);
            // The end period is the defined as the last minute of the day
            var employeeCountForStartPeriod:DepartmentEmployeeCountTimeEpoc = await this.getEmployeeCountByDepartmentAsOf(departmentCode, startPeriod);
            while(endPeriod <= endDate) {
                try {
                    // get employee counts for start and end period
                    this.logger.info(`Calling getSparqlQuery for ${departmentCode} on ${startPeriod}`);
                    const employeeCountForEndPeriod: DepartmentEmployeeCountTimeEpoc = await this.getEmployeeCountByDepartmentAsOf(departmentCode, endPeriod);
                    var joiners: EmployeeLeaverJoiner[] = await this.getDepartmentJoiners(departmentCode, startPeriod, endPeriod);
                    var leavers: EmployeeLeaverJoiner[] = await this.getDepartmentLeavers(departmentCode, startPeriod, endPeriod);

                    // check the Joiners/Leavers list.  It is possible that the original data has entires with an employee having and end date
                    // and start date on the same day.  This will cause the joiner/leaver to be counted twice.  So we need to remove them.
                    for(var joiner of joiners) {
                        for(var leaver of leavers) {
                            if(joiner.pid == leaver.pid) {
                                // if (Calendar.isSameDay(joiner.getDate(), leaver.getDate())) {
                                    this.logger.info(`Removing joiner/leaver ${joiner.pid} from joiner/leaver list.  Joiner: ${joiner.date} Leaver: ${leaver.date}`);
                                    joiners = joiners.filter((j) => j.pid != joiner.pid);
                                    leavers = leavers.filter((l) => l.pid != leaver.pid);
                                // }
                            }
                        }
                    }

                    const epoc = new DepartmentEmployeeCountWithJoinersLeaversEpoc(departmentCode, startPeriod, endPeriod);
                    epoc.setEmployeeCountAtStart(employeeCountForStartPeriod.getEmployeeCount());
                    epoc.setEmployeeCountAtEnd(employeeCountForEndPeriod.getEmployeeCount());
                    epoc.addJoiners(joiners);
                    epoc.addLeavers(leavers);
                    this.logger.info(employeeCountForEndPeriod);
                    timeseries.addPoint(epoc);

                    startPeriod = Calendar.getStartOfNextDay(endPeriod);
                    endPeriod= Calendar.getEndOfNextDay(startPeriod, dateStep);
                    employeeCountForStartPeriod = employeeCountForEndPeriod;
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
        const startDay = Calendar.getStartOfDay(startDate);
        const endDay = Calendar.getEndOfDay(endDate);
        this.logger.info(`getDepartmentJoiners(${departmentCode}, ${startDay}, ${endDay}).`);
        return new Promise<EmployeeLeaverJoiner[]>(async (resolve, reject) => {
            const sparqlQuery = sparqlJoinersQueryByDepartment(departmentCode, startDay, endDay);
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
        const startDay = Calendar.getStartOfDay(startDate);
        const endDay = Calendar.getEndOfDay(endDate);
        this.logger.info(`getDepartmentLeavers(${departmentCode}, ${startDay}, ${endDay}).`);
        return new Promise<EmployeeLeaverJoiner[]>(async (resolve, reject) => {
            const sparqlQuery = sparqlLeaversQueryByDepartment(departmentCode, startDay, endDay);
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

    getEmployeeCountByDepartmentAsOf(departmentCode: string, asOfDate: Date): Promise<DepartmentEmployeeCountTimeEpoc> {
        const startOfDay: Date = Calendar.getStartOfDay(asOfDate);
        const endOfDay: Date = Calendar.getEndOfDay(asOfDate);
        const sparqlQuery = sparqlDepartmentHistoryQuery(departmentCode, startOfDay, endOfDay);
        this.logger.info(`getEmployeeCountByDepartmentCode(${departmentCode}, ${startOfDay}).`);
        this.logger.info(`Sparql Query: ${sparqlQuery}`);
        return new Promise((resolve, reject) => {
            this.graphDB.sparqlQuery(sparqlQuery, SparqlQueryResultType.JSON)
            .then((result) => {
                this.logger.info(result);
                if (result.results.bindings.length > 0)
                    resolve(new DepartmentEmployeeCountTimeEpoc(departmentCode, startOfDay, endOfDay, result.results.bindings[0].count.value));
                else 
                    resolve(new DepartmentEmployeeCountTimeEpoc(departmentCode, startOfDay, endOfDay, 0));
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