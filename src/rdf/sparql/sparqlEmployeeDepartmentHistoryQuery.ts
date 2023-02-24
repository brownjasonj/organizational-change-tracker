import { EmployeeDepartmentEpoc } from "../../models/eom/EmployeeDepartmentEpoc";
import { EmployeeDepartmentEpocs } from "../../models/eom/EmployeeDepartmentEpocs";
import { IRdfGraphDB, SparqlQueryResultType } from "../../persistence/IRdfGraphDB";


const sparqlEmployeeDepartmentHistoryQuery = (graphdb: IRdfGraphDB) => {
    const sparqlQuery = 
    `prefix bank-org: <http://example.org/bank-org#>
    prefix bank-id: <http://example.org/bank-id#>
    prefix csorg: <http://example.org/org#>
    prefix foaf: <http://xmlns.com/foaf/0.1#>
    prefix org: <http://www.w3.org/ns/org#>
    prefix time: <http://www.w3.org/2006/time#>
    prefix interval: <http://example.org/interval#>
    prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>   
    prefix xsd: <http://www.w3.org/2000/01/rdf-schema#>
    
    select distinct ?pid ?department ?startDate ?endDate
    where {
        ?member org:organization ?org.              # find all members of the organization
          ?member org:member ?employee.
          ?employee bank-id:pid ?pid.
          ?org org:name ?department 
        {
          optional {
            select ?member (min(?date1) as ?startDate) (max(?date2) as ?endDate)
            where {
                  ?member org:memberDuring ?interval.			# determine when the member was a member of the organization
                  ?interval time:hasBeginning ?start.
                  ?interval time:hasEnd ?end.
                  ?start time:inXSDDateTimeStamp ?date1.
                    ?end time:inXSDDateTimeStamp ?date2.
            }
            group by ?member ?org ?startDate ?endDate
         } 
        }
    }`;
    return new Promise((resolve, reject) => {
        const employeeDepartmentEpocs = new Map<string, EmployeeDepartmentEpocs>();
        graphdb.sparqlQuery(sparqlQuery, SparqlQueryResultType.JSON)
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

export { sparqlEmployeeDepartmentHistoryQuery, EmployeeDepartmentEpoc, EmployeeDepartmentEpocs }