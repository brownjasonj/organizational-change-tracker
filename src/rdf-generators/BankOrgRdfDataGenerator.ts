import { write } from "fs";
import { Writer, DataFactory, NamedNode } from "n3";
import { DateTime } from "neo4j-driver-core";
import { CorporateRole } from "../models/eom/CorporateRole";

const { namedNode, literal, defaultGraph, quad, triple } = DataFactory;

import { Employee } from "../models/eom/Employee";

type rdfNameSpace = {
    prefix: string,
    path: string
};

const zeroPad = (num: number, places: number) => String(num).padStart(places, '0')
const dateAsId = (date: Date): string => {
    return `${date.getFullYear()}${zeroPad(date.getMonth() + 1, 2)}${zeroPad(date.getDay()+1, 2)}${zeroPad(date.getHours(), 2)}${zeroPad(date.getMinutes(), 2)}${zeroPad(date.getSeconds(), 2)}`
}

const bankOrgfNS: rdfNameSpace = {prefix: ":", path: ": <http://example.org/organization#>."};
const idNS: rdfNameSpace = {prefix: "id:", path: "http://example.org/id#"};
const pidNS: rdfNameSpace = {prefix: "pid:", path: "http://example.org/pid#"};
const foafNS: rdfNameSpace = {prefix: "foaf:", path: "http://xmlns.com/foaf/0.1#"};
const orgNS: rdfNameSpace = {prefix: "org:", path: "http://www.w3.org/ns/org#"};
const timeNS: rdfNameSpace = {prefix: "time:", path: "http://www.w3.org/2006/time#"};
const rdfNS: rdfNameSpace = {prefix: "rdf:", path: "http://www.w3.org/1999/02/22-rdf-syntax-ns#"};
const rdfsNS: rdfNameSpace = {prefix: "rdfs:", path: "http://www.w3.org/2001/XMLSchema#"};
const xsdNS: rdfNameSpace = {prefix: "xsd:", path: "http://www.w3.org/2000/01/rdf-schema#"};

/*
@prefix : <http://example.org/organization#>.
@prefix sh: <http://www.w3.org/ns/shacl#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix rdfs: <http://www.w3.org/2001/XMLSchema#>.
@prefix xsd: <http://www.w3.org/2000/01/rdf-schema#>.
@prefix id: <http://example.org/id#>.
@prefix foaf: <http://xmlns.com/foaf/0.1#>.
@prefix org: <http://www.w3.org/ns/org#>.
@prefix time: <http://www.w3.org/2006/time#>.
*/

function BankOrgRdfDataGenerator(employee:Employee): Promise<string> {
    const writer = new Writer({ prefixes: { '': 'http://example.org/organization#',
                                            id: 'http://example.org/id#',
                                            pid: 'http://example.org/pid#',
                                            foaf: 'http://xmlns.com/foaf/0.1#',
                                            org: 'http://www.w3.org/ns/org#',
                                            time: 'http://www.w3.org/2006/time#',
                                            rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
                                            rdfs: 'http://www.w3.org/2001/XMLSchema#',
                                            xsd: 'http://www.w3.org/2000/01/rdf-schema#'
                                        }});

    const staffRoleNode: NamedNode<string> = namedNode(bankOrgfNS.prefix + 'StaffTitle');
    const avpRoleNode: NamedNode<string> = namedNode(bankOrgfNS.prefix + 'AVPTitle');
    const vpRoleNode: NamedNode<string> = namedNode(bankOrgfNS.prefix + 'VPTitle');
    const dirRoleNode: NamedNode<string> = namedNode(bankOrgfNS.prefix + 'DIRTitle');
    const mdrRoleNode: NamedNode<string> = namedNode(bankOrgfNS.prefix + 'MDRTitle');


    const personNodeName: string = idNS.prefix + employee.employee_id;
    const personNode = namedNode(personNodeName.toLowerCase());
    writer.addQuads([
        triple(personNode, namedNode(rdfNS.path + 'type'), namedNode(bankOrgfNS.prefix + 'BankEmployee')),
        triple(personNode, namedNode(idNS.prefix + 'id'),literal(employee.employee_id)),
        triple(personNode, namedNode(pidNS.prefix + 'pid'),literal(employee.system_id)),
        triple(personNode, namedNode(foafNS.prefix + 'firstName'), literal(employee.firstName)),
        triple(personNode, namedNode(foafNS.prefix + 'surname'), literal(employee.secondName))
    ]);
    
    const organizationNode = createSubOrganizations(employee.department, writer);

    // set up the membership and time interval
    const organizationMembershipNodeName: string = (idNS.prefix + employee.employee_id + "-" + employee.department + "-membership").toLocaleLowerCase();
    const organizationMembershipNode = namedNode(organizationMembershipNodeName);

    const organizationMembershipTimeIntervalNodeName: string = (organizationMembershipNodeName + "-timeinterval").toLocaleLowerCase();
    const organizationMembershipTimeIntervalNode = namedNode(organizationMembershipTimeIntervalNodeName);
    
    writer.addQuads([
        triple(organizationMembershipNode, namedNode(rdfNS.path + 'type'), namedNode(bankOrgfNS.prefix + 'BankEmployeeOrganizationalEntityMembership')),
        triple(organizationMembershipNode, namedNode(orgNS.prefix + 'member'), personNode),
        triple(organizationMembershipNode, namedNode(orgNS.prefix + 'organization'), organizationNode),
        triple(organizationMembershipNode, namedNode(orgNS.prefix + 'memberDuring'), organizationMembershipTimeIntervalNode),
    ]);



    // Form time for the starting and ending of the duration.  The time is formed as an xsdDateTimeInstant and name of the 
    // node identifying the time is an id with a name of the form YYYYMMDDhhmmss, unique to the precision of seconds.  thousanths 
    // of a second are ignored
    const employeeStartDate: Date = (new Date(employee.departmentStartDate));
    const employeeStartDateId: string = dateAsId(employeeStartDate);
    const employeeEndDate: Date = (new Date(employee.departmentEndDate));
    const employeeEndDateId: string = dateAsId(employeeEndDate);

    const organizationMembershipTimeIntervalStartDateNodeName: string = (idNS.prefix + employeeStartDateId).toLocaleLowerCase();
    const organizationMembershipTimeIntervalStartDateNode = namedNode(organizationMembershipTimeIntervalStartDateNodeName);
    const organizationMembershipTimeIntervalEndDateNodeName: string = (idNS.prefix + employeeEndDateId).toLocaleLowerCase();
    const organizationMembershipTimeIntervalEndDateNode = namedNode(organizationMembershipTimeIntervalEndDateNodeName);

    writer.addQuads([
        triple(organizationMembershipTimeIntervalNode, namedNode(rdfNS.path + 'type'), namedNode(bankOrgfNS.prefix + 'MembershipDuration')),
        triple(organizationMembershipTimeIntervalNode, namedNode(timeNS.prefix + 'hasBeginning'), organizationMembershipTimeIntervalStartDateNode),
        triple(organizationMembershipTimeIntervalNode, namedNode(timeNS.prefix + 'hasEnd'), organizationMembershipTimeIntervalEndDateNode)
    ]);
    writer.addQuads([
        triple(organizationMembershipTimeIntervalStartDateNode, namedNode(rdfNS.path + 'type'), namedNode(bankOrgfNS.prefix + 'xsdDateTimeInstant')),
        triple(organizationMembershipTimeIntervalStartDateNode, namedNode(timeNS.prefix + 'inXSDDateTime'), literal(employeeStartDate.toISOString(),namedNode("xsd:dateTime")))
    ]);

    writer.addQuads([
        triple(organizationMembershipTimeIntervalEndDateNode, namedNode(rdfNS.path + 'type'), namedNode(bankOrgfNS.prefix + 'xsdDateTimeInstant')),
        triple(organizationMembershipTimeIntervalEndDateNode, namedNode(timeNS.prefix + 'inXSDDateTime'), literal(employeeEndDate.toISOString(), namedNode("xsd:dateTime")))
    ]);

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
    writer.addQuads([
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
    writer.addQuads([
        triple(corpTitleMembershipTimeIntervalNode, namedNode(rdfNS.path + 'type'), namedNode(bankOrgfNS.prefix + 'MembershipDuration')),
        triple(corpTitleMembershipTimeIntervalNode, namedNode(timeNS.prefix + 'hasBeginning'), corpTitleMembershipTimeIntervalStartDateNode),
        triple(corpTitleMembershipTimeIntervalNode, namedNode(timeNS.prefix + 'hasEnd'), corpTitleMembershipTimeIntervalEndDateNode)
    ]);


    writer.addQuads([
        triple(corpTitleMembershipTimeIntervalStartDateNode, namedNode(rdfNS.path + 'type'), namedNode(bankOrgfNS.prefix + 'xsdDateTimeInstant')),
        triple(corpTitleMembershipTimeIntervalStartDateNode, namedNode(timeNS.prefix + 'inXSDDateTime'), literal(employee.employmentStartDate.toISOString(), namedNode("xsd:dateTime")))
    ]);

    writer.addQuads([
        triple(corpTitleMembershipTimeIntervalEndDateNode, namedNode(rdfNS.path + 'type'), namedNode(bankOrgfNS.prefix + 'xsdDateTimeInstant')),
        triple(corpTitleMembershipTimeIntervalEndDateNode, namedNode(timeNS.prefix + 'inXSDDateTime'), literal(employee.departmentEndDate.toISOString(), namedNode("xsd:dateTime")))
    ]);

    // writer.end((error, result) => console.log(result));

    return new Promise((resolve, reject) => {
        writer.end((error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

function createSubOrganizations(organization: string, writer: Writer): NamedNode<string> {
    const departmentHierarchy: string[] = getDepartmentCodeHierarchy(organization).reverse();
    var departmentNodeNames: NamedNode<string>[] = [];
    var lastDepartmentNode: NamedNode<string> | null = null;

    departmentHierarchy.forEach((department: string) => {
        const organizationNodeName: string = idNS.prefix + department + "-organization";
        const organizationNode = namedNode(organizationNodeName.toLowerCase());
        writer.addQuads([
            triple(organizationNode, namedNode(rdfNS.path + 'type'), namedNode(orgNS.prefix + 'FormalOrganization')),
            triple(organizationNode, namedNode(orgNS.prefix + 'name'),literal(department))
        ]);
        if (lastDepartmentNode) {
            writer.addQuads([
                triple(organizationNode, namedNode(orgNS.prefix + 'subOrganizationOf'), lastDepartmentNode)
            ]);
        }
        lastDepartmentNode = organizationNode;
    });

    return lastDepartmentNode!;
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

export { BankOrgRdfDataGenerator };