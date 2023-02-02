import { DataFactory, NamedNode, Quad } from "n3";
import { CorporateRole } from "../models/eom/CorporateRole";
import { Employee } from "../models/eom/Employee";

const { namedNode, literal, defaultGraph, quad, triple } = DataFactory;

type rdfNameSpace = {
    prefix: string,
    path: string
};


type LinkedData = {
    prefixes: object,
    triples: Quad[]
};


const bankOrgfNS: rdfNameSpace = {prefix: "bank-org:", path: "http://example.org/bank-org#"};
const idNS: rdfNameSpace = {prefix: "bank-id:", path: "http://example.org/bank-id#"};
const pidNS: rdfNameSpace = {prefix: "bank-id:", path: "http://example.org/bank-is#"};
const foafNS: rdfNameSpace = {prefix: "foaf:", path: "http://xmlns.com/foaf/0.1#"};
const orgNS: rdfNameSpace = {prefix: "org:", path: "http://www.w3.org/ns/org#"};
const timeNS: rdfNameSpace = {prefix: "time:", path: "http://www.w3.org/2006/time#"};
const rdfNS: rdfNameSpace = {prefix: "rdf:", path: "http://www.w3.org/1999/02/22-rdf-syntax-ns#"};
const rdfsNS: rdfNameSpace = {prefix: "rdfs:", path: "http://www.w3.org/2001/XMLSchema#"};
const xsdNS: rdfNameSpace = {prefix: "xsd:", path: "http://www.w3.org/2000/01/rdf-schema#"};

const prefixes = { 'bank-org': 'http://example.org/bank-org#',
                    'bank-id': 'http://example.org/bank-id#',
                    foaf: 'http://xmlns.com/foaf/0.1#',
                    org: 'http://www.w3.org/ns/org#',
                    time: 'http://www.w3.org/2006/time#',
                    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
                    rdfs: 'http://www.w3.org/2001/XMLSchema#',
                    xsd: 'http://www.w3.org/2000/01/rdf-schema#'
                };


function createSubOrganizations(organization: string): Quad[] {
    const triples: Quad[] = [];
    const departmentHierarchy: string[] = getDepartmentCodeHierarchy(organization).reverse();
    var lastDepartmentNode: NamedNode<string> | null = null;

    departmentHierarchy.forEach((department: string) => {
        const organizationNodeName: string = idNS.prefix + department + "-organization";
        const organizationNode = namedNode(organizationNodeName.toLowerCase());
        triples.push(...[
            triple(organizationNode, namedNode(rdfNS.path + 'type'), namedNode(orgNS.prefix + 'FormalOrganization')),
            triple(organizationNode, namedNode(orgNS.prefix + 'name'),literal(department))
        ]);
        if (lastDepartmentNode) {
            triples.push(
                triple(organizationNode, namedNode(orgNS.prefix + 'subOrganizationOf'), lastDepartmentNode)
            );
        }
        lastDepartmentNode = organizationNode;
    });

    return triples;
}

/*
*/
function getDepartmentCodeHierarchy(str: string): string[] {
    const length: number = str.length;
    const result: string[] = [];

    for (let i = length; i != 0; i--) {
        if (str.charAt(i - 1) != " ") {
            result.push(str.slice(0, i));
        }
    }
    return result;
}

function GenerateBankOrgRdfTriples(employee:Employee): LinkedData {
    const triples: Quad[] = [];

    const staffRoleNode: NamedNode<string> = namedNode(bankOrgfNS.prefix + 'StaffTitle');
    const avpRoleNode: NamedNode<string> = namedNode(bankOrgfNS.prefix + 'AVPTitle');
    const vpRoleNode: NamedNode<string> = namedNode(bankOrgfNS.prefix + 'VPTitle');
    const dirRoleNode: NamedNode<string> = namedNode(bankOrgfNS.prefix + 'DIRTitle');
    const mdrRoleNode: NamedNode<string> = namedNode(bankOrgfNS.prefix + 'MDRTitle');


    const personNodeName: string = idNS.prefix + employee.employee_id;
    const personNode = namedNode(personNodeName.toLowerCase());

    triples.push(...[
        triple(personNode, namedNode(rdfNS.path + 'type'), namedNode(bankOrgfNS.prefix + 'BankEmployee')),
        triple(personNode, namedNode(idNS.prefix + 'id'),literal(employee.employee_id)),
        triple(personNode, namedNode(pidNS.prefix + 'pid'),literal(employee.system_id)),
        triple(personNode, namedNode(foafNS.prefix + 'firstName'), literal(employee.firstName)),
        triple(personNode, namedNode(foafNS.prefix + 'surname'), literal(employee.secondName))
    ]);
    
    const organizationalNodes = createSubOrganizations(employee.department);
    const organizationNode = organizationalNodes[organizationalNodes.length - 1];
    triples.push(...organizationalNodes);


    // set up the membership and time interval
    const organizationMembershipNodeName: string = (idNS.prefix + employee.employee_id + "-" + employee.department + "-membership").toLocaleLowerCase();
    const organizationMembershipNode = namedNode(organizationMembershipNodeName);

    const organizationMembershipTimeIntervalNodeName: string = (organizationMembershipNodeName + "-timeinterval").toLocaleLowerCase();
    const organizationMembershipTimeIntervalNode = namedNode(organizationMembershipTimeIntervalNodeName);
    
    triples.push(...[
        triple(organizationMembershipNode, namedNode(rdfNS.path + 'type'), namedNode(bankOrgfNS.prefix + 'BankEmployeeOrganizationalEntityMembership')),
        triple(organizationMembershipNode, namedNode(orgNS.prefix + 'member'), personNode),
        triple(organizationMembershipNode, namedNode(orgNS.prefix + 'organization'), organizationNode),
        triple(organizationMembershipNode, namedNode(orgNS.prefix + 'memberDuring'), organizationMembershipTimeIntervalNode),
    ]);



    // Form time for the starting and ending of the duration.  The time is formed as an xsdDateTimeInstant and name of the 
    // node identifying the time is an id with a name of the form YYYYMMDDhhmmss, unique to the precision of seconds.  thousanths 
    // of a second are ignored
    const deparmentStartDateId: string = dateAsId(new Date(employee.departmentStartDate));
    const departmentEndDateId: string = dateAsId(new Date(employee.departmentEndDate));

    const organizationMembershipTimeIntervalStartDateNodeName: string = (idNS.prefix + deparmentStartDateId).toLocaleLowerCase();
    const organizationMembershipTimeIntervalStartDateNode = namedNode(organizationMembershipTimeIntervalStartDateNodeName);
    const organizationMembershipTimeIntervalEndDateNodeName: string = (idNS.prefix + departmentEndDateId).toLocaleLowerCase();
    const organizationMembershipTimeIntervalEndDateNode = namedNode(organizationMembershipTimeIntervalEndDateNodeName);

    triples.push(...([
        triple(organizationMembershipTimeIntervalNode, namedNode(rdfNS.path + 'type'), namedNode(bankOrgfNS.prefix + 'MembershipDuration')),
        triple(organizationMembershipTimeIntervalNode, namedNode(timeNS.prefix + 'hasBeginning'), organizationMembershipTimeIntervalStartDateNode),
        triple(organizationMembershipTimeIntervalNode, namedNode(timeNS.prefix + 'hasEnd'), organizationMembershipTimeIntervalEndDateNode),
        triple(organizationMembershipTimeIntervalStartDateNode, namedNode(rdfNS.path + 'type'), namedNode(bankOrgfNS.prefix + 'xsdDateTimeInstant')),
        triple(organizationMembershipTimeIntervalStartDateNode, namedNode(timeNS.prefix + 'inXSDDateTimeStamp'), literal(employee.employmentStartDate.toISOString(),namedNode("xsd:dateTimeStamp"))),
        triple(organizationMembershipTimeIntervalStartDateNode, namedNode(bankOrgfNS.prefix + 'dateTimeStamp'), literal(employee.employmentStartDate.toISOString())),
        triple(organizationMembershipTimeIntervalEndDateNode, namedNode(rdfNS.path + 'type'), namedNode(bankOrgfNS.prefix + 'xsdDateTimeInstant')),
        triple(organizationMembershipTimeIntervalEndDateNode, namedNode(timeNS.prefix + 'inXSDDateTimeStamp'), literal(employee.employmentEndDate.toISOString(), namedNode("xsd:dateTimeStamp"))),
        triple(organizationMembershipTimeIntervalEndDateNode, namedNode(bankOrgfNS.prefix + 'dateTimeStamp'), literal(employee.employmentEndDate.toISOString()))
    ]));

    // Corporate Title Role Membership (e.g., Staff, Asoociate VP, VP, Director, Managing Director, etc.)

    var corporateTitleNode: NamedNode;
    var jobTitleName;
    switch (employee.jobTitle) {
        case CorporateRole.Staff:
            corporateTitleNode = staffRoleNode;
            jobTitleName = "Staff";
            break;
        case CorporateRole.AVP:
            corporateTitleNode = avpRoleNode;
            jobTitleName = "AVP";
            break;
        case CorporateRole.VP:
            jobTitleName = "VP";
            corporateTitleNode = vpRoleNode;
            break;
        case CorporateRole.DIR:
            jobTitleName = "DIR";
            corporateTitleNode = dirRoleNode;
            break;
        case CorporateRole.MDR:
            jobTitleName = "MDR";
            corporateTitleNode = mdrRoleNode;
            break;
        default:
            corporateTitleNode = staffRoleNode;
            jobTitleName = "Staff";
            break;
    }

    const corpTitleMembershipName: string = (idNS.prefix + employee.employee_id + "-" + jobTitleName + "-membership").toLocaleLowerCase();
    const coprTitleMembershipNode = namedNode(corpTitleMembershipName);
    const corpTitleMembershipTimeIntervalName: string = (corpTitleMembershipName + "-timeinterval").toLocaleLowerCase();
    const corpTitleMembershipTimeIntervalNode = namedNode(corpTitleMembershipTimeIntervalName);
    
    // corporate title membership
    triples.push(...[
        triple(coprTitleMembershipNode, namedNode(rdfNS.path + 'type'), namedNode(bankOrgfNS.prefix +  'BankEmployeeCorporateTitleMembership')),
        triple(coprTitleMembershipNode, namedNode(orgNS.prefix + 'member'), personNode),
        triple(coprTitleMembershipNode, namedNode(bankOrgfNS.prefix + 'BankCorporateTitle'), corporateTitleNode),
        triple(coprTitleMembershipNode, namedNode(orgNS.prefix + 'memberDuring'), corpTitleMembershipTimeIntervalNode),
    ]);

    const corpTitleStartDate: string = dateAsId(new Date(employee.employmentStartDate));
    const corpTitleEndDate: string = dateAsId(new Date(employee.employmentEndDate));
    const corpTitleMembershipTimeIntervalStartDateName: string = (idNS.prefix + corpTitleStartDate).toLocaleLowerCase();
    const corpTitleMembershipTimeIntervalStartDateNode = namedNode(corpTitleMembershipTimeIntervalStartDateName);
    const corpTitleMembershipTimeIntervalEndDateName: string = (idNS.prefix + corpTitleEndDate).toLocaleLowerCase();
    const corpTitleMembershipTimeIntervalEndDateNode = namedNode(corpTitleMembershipTimeIntervalEndDateName);


    // corporate title membership time interval
    triples.push(...[
        triple(corpTitleMembershipTimeIntervalNode, namedNode(rdfNS.path + 'type'), namedNode(bankOrgfNS.prefix + 'MembershipDuration')),
        triple(corpTitleMembershipTimeIntervalNode, namedNode(timeNS.prefix + 'hasBeginning'), corpTitleMembershipTimeIntervalStartDateNode),
        triple(corpTitleMembershipTimeIntervalNode, namedNode(bankOrgfNS.prefix + 'hasEnd'), corpTitleMembershipTimeIntervalEndDateNode),
        triple(corpTitleMembershipTimeIntervalStartDateNode, namedNode(rdfNS.path + 'type'), namedNode(bankOrgfNS.prefix + 'xsdDateTimeInstant')),
        triple(corpTitleMembershipTimeIntervalStartDateNode, namedNode(timeNS.prefix + 'inXSDDateTimeStamp'), literal(employee.employmentStartDate.toISOString(), namedNode("xsd:dateTimeStamp"))),
        triple(corpTitleMembershipTimeIntervalStartDateNode, namedNode(bankOrgfNS.prefix + 'dateTimeStamp'), literal(employee.employmentStartDate.toISOString())),
        triple(corpTitleMembershipTimeIntervalEndDateNode, namedNode(rdfNS.path + 'type'), namedNode(bankOrgfNS.prefix + 'xsdDateTimeInstant')),
        triple(corpTitleMembershipTimeIntervalEndDateNode, namedNode(timeNS.prefix + 'inXSDDateTimeStamp'), literal(employee.employmentEndDate.toISOString(), namedNode("xsd:dateTimeStamp"))),
        triple(corpTitleMembershipTimeIntervalEndDateNode, namedNode(bankOrgfNS.prefix + 'dateTimeStamp'), literal(employee.employmentEndDate.toISOString()))
    ]);

    // writer.end((error, result) => console.log(result));

    return {
        prefixes: prefixes,
        triples: triples
    };
}


const zeroPad = (num: number, places: number) => String(num).padStart(places, '0')
const dateAsId = (date: Date): string => {
    return `${date.getFullYear()}${zeroPad(date.getMonth() + 1, 2)}${zeroPad(date.getDay()+1, 2)}${zeroPad(date.getHours(), 2)}${zeroPad(date.getMinutes(), 2)}${zeroPad(date.getSeconds(), 2)}`
}

export { GenerateBankOrgRdfTriples }