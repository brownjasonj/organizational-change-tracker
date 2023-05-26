import { Employee } from "../models/eom/Employee";
import { IRdfGraphDB, SparqlQueryResultType } from "../persistence/IRdfGraphDB";
import { IOrganizationRdfQuery } from "./IOrganizationRdfQuery";
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
import { sparqlEmployeeByEmployeeIdQuery } from "./sparql/idqueries/sparqlEmployeeByEmployeeIdQuery";
import { sparqlOrganizationByOrganizationIdQuery } from "./sparql/idqueries/sparqlOrganizationByOrganizationIdQuery";
import { sparqlMembershipByMembershipIdQuery } from "./sparql/idqueries/sparqlMembershipByMembershipIdQuery";
import { sparqlTimeByTimeIdQuery } from "./sparql/idqueries/sparqlTimeByTimeIdQuery";
import { sparqlTimeIntervalByTimeIntervalId } from "./sparql/idqueries/sparqlTimeIntervalByTimeIntervalIdQuery";
import { sparqlEmployeeByEmployeeSystemIdQuery } from "./sparql/idqueries/sparqlEmployeeByEmployeeSystemIdQuery";
import { SparqlJsonParser } from "sparqljson-parse";

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

            // start period is the start of the day of the given start date
            var startPeriod = Calendar.getStartOfDay(startDate);
            var endPeriod = Calendar.getEndOfNextDay(startPeriod, dateStep);
            this.logger.info(`startPeriod: ${startPeriod} endPeriod: ${endPeriod}`);
            // Get employee count for the start period
            var employeeCountForStartPeriod:DepartmentEmployeeCountTimeEpoc = await this.getEmployeeCountByDepartmentAsOf(departmentCode, startPeriod);
            while(endPeriod <= endDate) {
                try {
                    // get employee counts for start and end period
                    const employeeCountForEndPeriod: DepartmentEmployeeCountTimeEpoc = await this.getEmployeeCountByDepartmentAsOf(departmentCode, endPeriod);
                    var joiners: EmployeeLeaverJoiner[] = await this.getDepartmentJoiners(departmentCode, startPeriod, endPeriod);
                    var leavers: EmployeeLeaverJoiner[] = await this.getDepartmentLeavers(departmentCode, startPeriod, endPeriod);

                    // check the Joiners/Leavers list.  It is possible that the original data has entires with an employee having and end date
                    // and start date on the same day.  This will cause the joiner/leaver to be counted twice.  So we need to remove them.
                    for(var joiner of joiners) {
                        for(var leaver of leavers) {
                            if(joiner.getEmployeeId() == leaver.getEmployeeId()) {
                                if (Calendar.isConsequtiveDay(joiner.getDate(), leaver.getDate())) {
                                    this.logger.info(`Removing joiner/leaver ${joiner.getEmployeeId()} from joiner/leaver list.  Joiner: ${joiner.date} Leaver: ${leaver.date}`);
                                    joiners = joiners.filter((j) => j.getEmployeeId() != joiner.getEmployeeId());
                                    leavers = leavers.filter((l) => l.getEmployeeId() != leaver.getEmployeeId());
                                }
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
                    joinerSet.push(new EmployeeLeaverJoiner(joiner.employee.value, joiner.department.value, new Date(joiner.startingDate.value as string), EmployeeLeaverJoinerType.JOINER));
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
            console.log(sparqlQuery);
            var joinerSet: EmployeeLeaverJoiner[] = [];
            this.graphDB.sparqlQuery(sparqlQuery, SparqlQueryResultType.JSON)
            .then((result) => {
                this.logger.info(result);
                for(var joiner of result.results.bindings) {
                    this.logger.info(joiner);
                    joinerSet.push(new EmployeeLeaverJoiner(joiner.employee.value, joiner.department.value, new Date(joiner.endingDate.value as string), EmployeeLeaverJoinerType.LEAVER));
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
        console.log(sparqlQuery);
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
                    const startDate = new Date(binding.startDate.value.split("^^")[0]);
                    const endDate = new Date(binding.endDate.value.split("^^")[0]);
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
                    const startDate = new Date(binding.startDate.value.split("^^")[0]);
                    const endDate = new Date(binding.endDate.value.split("^^")[0]);
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
            this.logger.info(`getEmployeeCorporateTitleHistoryByEmployeeId(${employeeId}).`);
            this.logger.info(`Sparql Query: ${sparqlQuery}`);
            console.log(sparqlQuery);
            this.graphDB.sparqlQuery(sparqlQuery, SparqlQueryResultType.JSON)
            .then((result) => {
                const employeeCorporateTitleEpocs = new EmployeeCorporateTitleEpocs(employeeId);
                this.logger.info(result);
                result.results.bindings.forEach((binding: any) => {
                    const corporateTitle = binding.corpTitle.value;
                    const startDate = new Date(binding.startDate.value.split("^^")[0]);
                    const endDate = new Date(binding.endDate.value.split("^^")[0]);
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

    
    getEmployeeByEmployeeId(employeeId: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const sparqlQuery = sparqlEmployeeByEmployeeIdQuery(employeeId);
            this.logger.info(`getEmployeeByEmployeeId(${employeeId}).`);
            this.logger.info(`Sparql Query: ${sparqlQuery}`);
            this.graphDB.sparqlQuery(sparqlQuery, SparqlQueryResultType.JSON)
            .then((result) => {
                this.logger.info(result);
                if (result.results.bindings.length > 0) {
                    const sparqlJsonParser = new SparqlJsonParser();
                    resolve(sparqlJsonParser.parseJsonResults(result));
                }
                else 
                    resolve(null);
            })
            .catch((error) => {
                this.logger.error(error);
                return reject(error);
            });
        });
    }

    getEmployeeByEmployeeSystemId(employeeSystemId: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const sparqlQuery = sparqlEmployeeByEmployeeSystemIdQuery(employeeSystemId);
            this.logger.info(`getEmployeeByEmployeeSystemId(${employeeSystemId}).`);
            this.logger.info(`Sparql Query: ${sparqlQuery}`);
            this.graphDB.sparqlQuery(sparqlQuery, SparqlQueryResultType.JSON)
            .then((result) => {
                this.logger.info(result);
                if (result.results.bindings.length > 0) {
                    const id = result.results.bindings[0].id.value;
                    this.getEmployeeByEmployeeId(id).then((employee) => {
                        resolve(employee);
                    }
                    ).catch((error) => {
                        reject(error);
                    });
                }
                else {
                    reject({error: `Employee with employeeSystemId ${employeeSystemId} not found.`});
                }
            })
            .catch((error) => {
                this.logger.error(error);
                return reject(error);
            });
        });
    }

    getOrganizationByOrganizationId(organizationId: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const sparqlQuery = sparqlOrganizationByOrganizationIdQuery(organizationId);
            this.logger.info(`getOrganizationByOrganizationId(${organizationId}).`);
            this.logger.info(`Sparql Query: ${sparqlQuery}`);
            this.graphDB.sparqlQuery(sparqlQuery, SparqlQueryResultType.JSON)
            .then((result) => {
                this.logger.info(result);
                if (result.results.bindings.length > 0) {
                    const sparqlJsonParser = new SparqlJsonParser();
                    resolve(sparqlJsonParser.parseJsonResults(result));
                }
                else 
                    resolve(null);
            })
            .catch((error) => {
                this.logger.error(error);
                return reject(error);
            });
        });
    }


    getMembershipByMembershipId(membershipId: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const sparqlQuery = sparqlMembershipByMembershipIdQuery(membershipId);
            this.logger.info(`getMembershipByMembershipId(${membershipId}).`);
            this.logger.info(`Sparql Query: ${sparqlQuery}`);
            this.graphDB.sparqlQuery(sparqlQuery, SparqlQueryResultType.JSON)
            .then((result) => {
                this.logger.info(result);
                if (result.results.bindings.length > 0) {
                    const sparqlJsonParser = new SparqlJsonParser();
                    resolve(sparqlJsonParser.parseJsonResults(result));
                }
                else {
                    resolve(null);
                }
            })
            .catch((error) => {
                this.logger.error(error);
                return reject(error);
            });
        });
    }

    getTimeByTimeId(timeId: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const sparqlQuery = sparqlTimeByTimeIdQuery(timeId);
            this.logger.info(`getTimeByTimeId(${timeId}).`);
            this.logger.info(`Sparql Query: ${sparqlQuery}`);
            this.graphDB.sparqlQuery(sparqlQuery, SparqlQueryResultType.JSON)
            .then((result) => {
                this.logger.info(result);
                if (result.results.bindings.length > 0){
                    const sparqlJsonParser = new SparqlJsonParser();
                    resolve(sparqlJsonParser.parseJsonResults(result));
                }
                else {
                    resolve(null);
                }
            })
            .catch((error) => {
                this.logger.error(error);
                return reject(error);
            });
        });
    }

    getTimeIntervalByTimeIntervalId(timeIntervalId: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const sparqlQuery = sparqlTimeIntervalByTimeIntervalId(timeIntervalId);
            this.logger.info(`getTimeIntervalByTimeIntervalId(${timeIntervalId}).`);
            this.logger.info(`Sparql Query: ${sparqlQuery}`);
            this.graphDB.sparqlQuery(sparqlQuery, SparqlQueryResultType.JSON)
            .then((result) => {
                this.logger.info(result);
                if (result.results.bindings.length > 0) {
                    const sparqlJsonParser = new SparqlJsonParser();
                    resolve(sparqlJsonParser.parseJsonResults(result));
                }
                else {
                    resolve(null);
                }
            })
            .catch((error) => {
                this.logger.error(error);
                return reject(error);
            });
        });
    }
}

export { RdfCompliantBackend }