import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios'; 

declare namespace $1270018000 {
    namespace BankOrg {
        /**
         * The date of the employee count.
         */
        export type AsOfDate = string; // time
        /**
         * n/a
         */
        export type BankOrganizationEmployeeCount = number;
        /**
         * DepartmentEmployeeCount
         * n/a
         */
        export interface DepartmentEmployeeCount {
            /**
             * OrganizationalEntity
             * The organizational entity.
             */
            organizationalEntity: {
                /**
                 * n/a
                 */
                Name: string;
                /**
                 * n/a
                 */
                SubOrganizationOf?: any;
            };
            /**
             * The date of the employee count.
             */
            asOfDate: string; // time
            /**
             * n/a
             */
            BankOrganizationEmployeeCount: number;
        }
        /**
         * OrganizationalEntity
         * The organizational entity.
         */
        export interface OrganizationalEntity {
            /**
             * n/a
             */
            Name: string;
            /**
             * n/a
             */
            SubOrganizationOf?: any;
        }
    }
}
declare namespace Components {
    namespace Schemas {
        export interface AddEmployeeLoadStatus {
            resourceLocation?: string;
            requestId?: string;
            createdDateTime?: string;
            completedDateTime?: string;
            entriesProgressed?: number;
            status?: "processing" | "complete" | "error";
            error?: string;
        }
        export type DateStep = "day" | "week" | "month" | "year";
        export interface DepartmentHistory {
            /**
             * example:
             * 2019-05-17
             */
            startDate?: string;
            /**
             * example:
             * 2019-05-17
             */
            endDate?: string;
            dateStep?: DateStep;
            history?: HistoricPoint[];
        }
        export interface Employee {
            employee_id?: string;
            system_id?: string;
            firstName?: string;
            secondName?: string;
            jobTitle?: string;
            department?: string;
            /**
             * example:
             * 2019-05-17
             */
            departmentStartDate?: string;
            /**
             * example:
             * 2019-05-17
             */
            departmentEndDate?: string;
            /**
             * example:
             * 2019-05-17
             */
            employmentStartDate?: string;
            /**
             * example:
             * 2019-05-17
             */
            employementEndDate?: string;
        }
        export interface EmployeeDepartmentEpoc {
            employeeId?: string;
            /**
             * example:
             * ABCD1
             */
            department?: string;
            /**
             * example:
             * 2019-05-17
             */
            startdate?: string;
            /**
             * example:
             * 2019-05-17
             */
            enddate?: string;
        }
        export interface EmployeeDepartmentEpocs {
            employeeId?: string;
            epoc?: EmployeeDepartmentEpoc[];
        }
        export interface EmployeeRoleEpoc {
            /**
             * example:
             * Vice President
             */
            role?: string;
            /**
             * example:
             * 2019-05-17
             */
            startdate?: string;
            /**
             * example:
             * 2019-05-17
             */
            enddate?: string;
        }
        export type EmployeeRoleEpocs = EmployeeRoleEpoc[];
        export type Employees = Employee[];
        export type EmployeesDepartmentEpocs = EmployeeDepartmentEpocs[];
        export interface HistoricPoint {
            /**
             * example:
             * ABCD1
             */
            department?: string;
            /**
             * example:
             * 2019-05-17
             */
            date?: string;
            /**
             * example:
             * 23
             */
            size?: number;
            joiners?: Employee[];
            leavers?: Employee[];
            members?: Employee[];
        }
    }
}
declare namespace Paths {
    namespace AddemployeeGet {
        namespace Responses {
            export interface $200 {
            }
        }
    }
    namespace AddemployeesPost {
        namespace Parameters {
            export type EmployeeEndsBefore = string;
        }
        export interface QueryParameters {
            employeeEndsBefore?: Parameters.EmployeeEndsBefore;
        }
        export interface RequestBody {
            file?: string; // base64
        }
        namespace Responses {
            export interface $202 {
            }
            export interface $400 {
            }
        }
    }
    namespace DepartmentCodes {
        namespace Parameters {
            export type AsOf = string;
        }
        export interface QueryParameters {
            asOf: Parameters.AsOf;
        }
        namespace Responses {
            export type $200 = string[];
        }
    }
    namespace DepartmentHistory {
        namespace Parameters {
            export type DateStep = Components.Schemas.DateStep;
            export type DepartmentCode = string;
            export type EndDate = string;
            export type StartDate = string;
        }
        export interface QueryParameters {
            departmentCode: Parameters.DepartmentCode;
            startDate: Parameters.StartDate;
            endDate?: Parameters.EndDate;
            dateStep?: Parameters.DateStep;
        }
        namespace Responses {
            export type $200 = Components.Schemas.DepartmentHistory;
        }
    }
    namespace DepartmentHistoryWithJoinersLeaver {
        namespace Parameters {
            export type DateStep = Components.Schemas.DateStep;
            export type DepartmentCode = string;
            export type EndDate = string;
            export type StartDate = string;
        }
        export interface QueryParameters {
            departmentCode: Parameters.DepartmentCode;
            startDate: Parameters.StartDate;
            endDate?: Parameters.EndDate;
            dateStep?: Parameters.DateStep;
        }
        namespace Responses {
            export type $200 = Components.Schemas.DepartmentHistory;
        }
    }
    namespace DepartmentJoiners {
        namespace Parameters {
            export type DateStep = Components.Schemas.DateStep;
            export type DepartmentCode = string;
            export type EndDate = string;
            export type StartDate = string;
        }
        export interface QueryParameters {
            departmentCode: Parameters.DepartmentCode;
            startDate: Parameters.StartDate;
            endDate?: Parameters.EndDate;
            dateStep?: Parameters.DateStep;
        }
        namespace Responses {
            export type $200 = Components.Schemas.DepartmentHistory;
        }
    }
    namespace DepartmentLeavers {
        namespace Parameters {
            export type DateStep = Components.Schemas.DateStep;
            export type DepartmentCode = string;
            export type EndDate = string;
            export type StartDate = string;
        }
        export interface QueryParameters {
            departmentCode?: Parameters.DepartmentCode;
            startDate: Parameters.StartDate;
            endDate?: Parameters.EndDate;
            dateStep?: Parameters.DateStep;
        }
        namespace Responses {
            export interface $200 {
            }
        }
    }
    namespace EmployeeByEmployeeId {
        namespace Parameters {
            export type EmployeeId = string;
        }
        export interface PathParameters {
            employeeId: Parameters.EmployeeId;
        }
    }
    namespace EmployeeCountByDepartmentCode {
        namespace Parameters {
            export type AsOf = string;
            export type DepartmentCode = string;
        }
        export interface QueryParameters {
            departmentCode: Parameters.DepartmentCode;
            asOf: Parameters.AsOf;
        }
        namespace Responses {
            export type $200 = Components.Schemas.Employee;
            export interface $400 {
            }
            export interface $500 {
            }
        }
    }
    namespace EmployeeDepartmentHistory {
        namespace Responses {
            export type $200 = Components.Schemas.EmployeeDepartmentEpocs;
        }
    }
    namespace EmployeeDepartmentHistoryByEmployeeId {
        namespace Parameters {
            export type EmployeeId = string;
        }
        export interface QueryParameters {
            employeeId: Parameters.EmployeeId;
        }
        namespace Responses {
            export type $200 = Components.Schemas.EmployeeDepartmentEpocs;
        }
    }
    namespace EmployeeRoleHistoryByEmployeeId {
        namespace Parameters {
            export type EmployeeId = string;
        }
        export interface QueryParameters {
            employeeId: Parameters.EmployeeId;
        }
        namespace Responses {
            export type $200 = Components.Schemas.EmployeeRoleEpocs;
        }
    }
    namespace MembershipByMembershipId {
        namespace Parameters {
            export type MembershipId = string;
        }
        export interface PathParameters {
            membershipId: Parameters.MembershipId;
        }
        namespace Responses {
            export interface $200 {
            }
        }
    }
    namespace OperationsDeleteTriples {
        namespace Responses {
            export interface $200 {
            }
            export interface $500 {
            }
        }
    }
    namespace OperationsGetConfiguration {
        namespace Responses {
            export interface $200 {
            }
            export interface $500 {
            }
        }
    }
    namespace OperationsLoadingStatus {
        namespace Parameters {
            export type Requestid = string;
        }
        export interface PathParameters {
            requestid: Parameters.Requestid;
        }
        namespace Responses {
            export type $200 = Components.Schemas.AddEmployeeLoadStatus;
        }
    }
    namespace OrganizationByOrganizationId {
        namespace Parameters {
            export type OrganizationId = string;
        }
        export interface PathParameters {
            organizationId: Parameters.OrganizationId;
        }
        namespace Responses {
            export interface $200 {
            }
        }
    }
    namespace Test {
        namespace Responses {
            export interface $200 {
            }
        }
    }
    namespace TimeByTimeId {
        namespace Parameters {
            export type TimeId = string;
        }
        export interface PathParameters {
            timeId: Parameters.TimeId;
        }
        namespace Responses {
            export interface $200 {
            }
        }
    }
    namespace TimeIntervalByTimeIntervalId {
        namespace Parameters {
            export type TimeIntervalId = string;
        }
        export interface PathParameters {
            timeIntervalId: Parameters.TimeIntervalId;
        }
        namespace Responses {
            export interface $200 {
            }
        }
    }
    namespace Upload {
        export interface RequestBody {
            file?: string; // base64
        }
        namespace Responses {
            export interface $202 {
            }
        }
    }
}
declare namespace WwwW3Org {
    namespace Ns {
        namespace Org {
            /**
             * n/a
             */
            export type Name = string;
            /**
             * n/a
             */
            export type SubOrganizationOf = any;
        }
    }
}

export interface OperationMethods {
  /**
   * test - Simple test end-point returning a Hello World!
   */
  'test'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.Test.Responses.$200>
  /**
   * addemployeeGet - Simple test end-point returning a Hello World!
   */
  'addemployeeGet'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.AddemployeeGet.Responses.$200>
  /**
   * addemployeesPost - Upload of employee data
   */
  'addemployeesPost'(
    parameters?: Parameters<Paths.AddemployeesPost.QueryParameters> | null,
    data?: Paths.AddemployeesPost.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.AddemployeesPost.Responses.$202>
  /**
   * employee-count-by-department-code - Simple test end-point returning a Hello World!
   */
  'employee-count-by-department-code'(
    parameters?: Parameters<Paths.EmployeeCountByDepartmentCode.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.EmployeeCountByDepartmentCode.Responses.$200>
  /**
   * employeeDepartmentHistory - get the history of which department an employee has gone through.  for all employees.
   */
  'employeeDepartmentHistory'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.EmployeeDepartmentHistory.Responses.$200>
  /**
   * employeeDepartmentHistoryByEmployeeId - get the history of which department an employee has gone through.
   */
  'employeeDepartmentHistoryByEmployeeId'(
    parameters?: Parameters<Paths.EmployeeDepartmentHistoryByEmployeeId.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.EmployeeDepartmentHistoryByEmployeeId.Responses.$200>
  /**
   * employeeRoleHistoryByEmployeeId - get the history of which role an employee has gone through.
   */
  'employeeRoleHistoryByEmployeeId'(
    parameters?: Parameters<Paths.EmployeeRoleHistoryByEmployeeId.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.EmployeeRoleHistoryByEmployeeId.Responses.$200>
  /**
   * departmentHistory - get the history evolution of a department showing change is size over time and movement of people in and out
   */
  'departmentHistory'(
    parameters?: Parameters<Paths.DepartmentHistory.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DepartmentHistory.Responses.$200>
  /**
   * departmentHistoryWithJoinersLeaver - get the history evolution of a department showing change is size over time and movement of people in and out
   */
  'departmentHistoryWithJoinersLeaver'(
    parameters?: Parameters<Paths.DepartmentHistoryWithJoinersLeaver.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DepartmentHistoryWithJoinersLeaver.Responses.$200>
  /**
   * departmentJoiners - get list of employees that joined a department in a particular period
   */
  'departmentJoiners'(
    parameters?: Parameters<Paths.DepartmentJoiners.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DepartmentJoiners.Responses.$200>
  /**
   * departmentLeavers - get list of employees that left a department in a particular period
   */
  'departmentLeavers'(
    parameters?: Parameters<Paths.DepartmentLeavers.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DepartmentLeavers.Responses.$200>
  /**
   * department-codes - get a list of department codes as of a given date
   */
  'department-codes'(
    parameters?: Parameters<Paths.DepartmentCodes.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DepartmentCodes.Responses.$200>
  /**
   * upload - upload a binary file
   */
  'upload'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.Upload.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.Upload.Responses.$202>
  /**
   * operationsLoadingStatus - Pollable end-point to check the status of the load
   */
  'operationsLoadingStatus'(
    parameters?: Parameters<Paths.OperationsLoadingStatus.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.OperationsLoadingStatus.Responses.$200>
  /**
   * operationsDeleteTriples - Operational function to delete all triples from the graph database
   */
  'operationsDeleteTriples'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.OperationsDeleteTriples.Responses.$200>
  /**
   * operationsGetConfiguration - Operational function to get the configuration being used by the application
   */
  'operationsGetConfiguration'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.OperationsGetConfiguration.Responses.$200>
  /**
   * employeeByEmployeeId - get the employees data by employee id
   */
  'employeeByEmployeeId'(
    parameters?: Parameters<Paths.EmployeeByEmployeeId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<any>
  /**
   * organizationByOrganizationId - get the organization data by organization id
   */
  'organizationByOrganizationId'(
    parameters?: Parameters<Paths.OrganizationByOrganizationId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.OrganizationByOrganizationId.Responses.$200>
  /**
   * timeByTimeId - get the time data by time id
   */
  'timeByTimeId'(
    parameters?: Parameters<Paths.TimeByTimeId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.TimeByTimeId.Responses.$200>
  /**
   * timeIntervalByTimeIntervalId - get the time interval data by time interval id
   */
  'timeIntervalByTimeIntervalId'(
    parameters?: Parameters<Paths.TimeIntervalByTimeIntervalId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.TimeIntervalByTimeIntervalId.Responses.$200>
  /**
   * membershipByMembershipId - get the membership data by mmbership id
   */
  'membershipByMembershipId'(
    parameters?: Parameters<Paths.MembershipByMembershipId.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.MembershipByMembershipId.Responses.$200>
}

export interface PathsDictionary {
  ['/test']: {
    /**
     * test - Simple test end-point returning a Hello World!
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.Test.Responses.$200>
  }
  ['/addemployee']: {
    /**
     * addemployeeGet - Simple test end-point returning a Hello World!
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.AddemployeeGet.Responses.$200>
  }
  ['/addemployees']: {
    /**
     * addemployeesPost - Upload of employee data
     */
    'post'(
      parameters?: Parameters<Paths.AddemployeesPost.QueryParameters> | null,
      data?: Paths.AddemployeesPost.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.AddemployeesPost.Responses.$202>
  }
  ['/employee-count-by-department-code']: {
    /**
     * employee-count-by-department-code - Simple test end-point returning a Hello World!
     */
    'get'(
      parameters?: Parameters<Paths.EmployeeCountByDepartmentCode.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.EmployeeCountByDepartmentCode.Responses.$200>
  }
  ['/employee-department-history']: {
    /**
     * employeeDepartmentHistory - get the history of which department an employee has gone through.  for all employees.
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.EmployeeDepartmentHistory.Responses.$200>
  }
  ['/employee-department-history-by-employeeid']: {
    /**
     * employeeDepartmentHistoryByEmployeeId - get the history of which department an employee has gone through.
     */
    'get'(
      parameters?: Parameters<Paths.EmployeeDepartmentHistoryByEmployeeId.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.EmployeeDepartmentHistoryByEmployeeId.Responses.$200>
  }
  ['/employee-role-history-by-employeeid']: {
    /**
     * employeeRoleHistoryByEmployeeId - get the history of which role an employee has gone through.
     */
    'get'(
      parameters?: Parameters<Paths.EmployeeRoleHistoryByEmployeeId.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.EmployeeRoleHistoryByEmployeeId.Responses.$200>
  }
  ['/department-history']: {
    /**
     * departmentHistory - get the history evolution of a department showing change is size over time and movement of people in and out
     */
    'get'(
      parameters?: Parameters<Paths.DepartmentHistory.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DepartmentHistory.Responses.$200>
  }
  ['/department-history-with-joinersleavers']: {
    /**
     * departmentHistoryWithJoinersLeaver - get the history evolution of a department showing change is size over time and movement of people in and out
     */
    'get'(
      parameters?: Parameters<Paths.DepartmentHistoryWithJoinersLeaver.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DepartmentHistoryWithJoinersLeaver.Responses.$200>
  }
  ['/department-joiners']: {
    /**
     * departmentJoiners - get list of employees that joined a department in a particular period
     */
    'get'(
      parameters?: Parameters<Paths.DepartmentJoiners.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DepartmentJoiners.Responses.$200>
  }
  ['/department-leavers']: {
    /**
     * departmentLeavers - get list of employees that left a department in a particular period
     */
    'get'(
      parameters?: Parameters<Paths.DepartmentLeavers.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DepartmentLeavers.Responses.$200>
  }
  ['/department-codes']: {
    /**
     * department-codes - get a list of department codes as of a given date
     */
    'get'(
      parameters?: Parameters<Paths.DepartmentCodes.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DepartmentCodes.Responses.$200>
  }
  ['/upload']: {
    /**
     * upload - upload a binary file
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.Upload.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.Upload.Responses.$202>
  }
  ['/operations/load/{requestid}']: {
    /**
     * operationsLoadingStatus - Pollable end-point to check the status of the load
     */
    'get'(
      parameters?: Parameters<Paths.OperationsLoadingStatus.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.OperationsLoadingStatus.Responses.$200>
  }
  ['/operations/delete']: {
    /**
     * operationsDeleteTriples - Operational function to delete all triples from the graph database
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.OperationsDeleteTriples.Responses.$200>
  }
  ['/operations/configuration']: {
    /**
     * operationsGetConfiguration - Operational function to get the configuration being used by the application
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.OperationsGetConfiguration.Responses.$200>
  }
  ['/id/employee-id/{employeeId}']: {
    /**
     * employeeByEmployeeId - get the employees data by employee id
     */
    'get'(
      parameters?: Parameters<Paths.EmployeeByEmployeeId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<any>
  }
  ['/id/organization-id/{organizationId}']: {
    /**
     * organizationByOrganizationId - get the organization data by organization id
     */
    'get'(
      parameters?: Parameters<Paths.OrganizationByOrganizationId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.OrganizationByOrganizationId.Responses.$200>
  }
  ['/id/time-id/{timeId}']: {
    /**
     * timeByTimeId - get the time data by time id
     */
    'get'(
      parameters?: Parameters<Paths.TimeByTimeId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.TimeByTimeId.Responses.$200>
  }
  ['/id/time-interval-id/{timeIntervalId}']: {
    /**
     * timeIntervalByTimeIntervalId - get the time interval data by time interval id
     */
    'get'(
      parameters?: Parameters<Paths.TimeIntervalByTimeIntervalId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.TimeIntervalByTimeIntervalId.Responses.$200>
  }
  ['/id/membership-id/{membershipId}']: {
    /**
     * membershipByMembershipId - get the membership data by mmbership id
     */
    'get'(
      parameters?: Parameters<Paths.MembershipByMembershipId.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.MembershipByMembershipId.Responses.$200>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>
