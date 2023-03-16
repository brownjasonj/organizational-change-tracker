import { EmployeeCountByDepartmentTimeEpoc } from "../../models/eom/EmployeeCountByDepartmentTimeEpoc";
import { IRdfGraphDB, SparqlQueryResultType } from "../../persistence/IRdfGraphDB";

const sparqlDepartmentHistoryQuery = (graphdb: IRdfGraphDB,  departmentCode: string, startDate: Date, endDate: Date): Promise<EmployeeCountByDepartmentTimeEpoc> => {
    const sparqlQuery = `prefix org: <http://www.w3.org/ns/org#>
    prefix time: <http://www.w3.org/2006/time#>
    prefix xsd: <http://www.w3.org/2001/XMLSchema#>
    
    SELECT  ?name
            (count(distinct ?member) as ?count)
    WHERE {
        ?parentorg org:name "${departmentCode}".                   #find parent organization with given name for which you want to count employees
        ?parentorg org:name ?name.
        ?member org:organization ?org.              # find all members of the organization
        ?org org:subOrganizationOf* ?parentorg.     # where the organization is a suborganization of the parent organization
        ?member org:memberDuring ?interval.         # determine when the member was a member of the organization
        ?interval time:hasBeginning ?start.
        ?interval time:hasEnd ?end.
        ?start time:inXSDDateTimeStamp ?date1.
        ?end time:inXSDDateTimeStamp ?date2.
        filter (
            ?date1 <= "${startDate.toISOString()}"^^xsd:dateTime
            && ?date2 >= "${endDate.toISOString()}"^^xsd:dateTime).
    }
    GROUP BY ?name ?count
    `;

    console.log(sparqlQuery);
    return new Promise((resolve, reject) => {
        graphdb.sparqlQuery(sparqlQuery, SparqlQueryResultType.JSON)
        .then((result) => {
            console.log(result);
            if (result.results.bindings.length > 0)
                resolve(new EmployeeCountByDepartmentTimeEpoc(departmentCode, startDate, result.results.bindings[0].count.value));
            else 
                resolve(new EmployeeCountByDepartmentTimeEpoc(departmentCode, startDate, 0));
        })
        .catch((error) => {
            console.log(error);
            return reject(error);
        });
    });
}





export { sparqlDepartmentHistoryQuery }