import { Response } from "express"
import { Context, Request } from "openapi-backend"


const getSparqlQuery = (employeeId: string) => {
    return `prefix bank-org: <http://example.org/bank-org#>
    prefix bank-id: <http://example.org/bank-id#>
    prefix org: <http://www.w3.org/ns/org#>
    prefix time: <http://www.w3.org/2006/time#>
    prefix interval: <http://example.org/interval#>
    prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    prefix xsd: <http://www.w3.org/2001/XMLSchema#>
    
    select  distinct ?corpTitle
	where {
        ?employee rdf:type bank-org:BankEmployee.
        ?employee bank-id:id "e10".
		?corpTitleMembership org:member ?employee.
        ?corpTitleMembership bank-org:BankCorporateTitle ?corpTitle.

    }`;
}

const employeeRoleHistoryHandler = async (context: Context, request: Request, response: Response) => {
    console.log(request.body);
    response.json({ message: "done" });
}

export { employeeRoleHistoryHandler }