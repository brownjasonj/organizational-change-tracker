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

const idNS: rdfNameSpace = {prefix: ":", path: "http://example.org/id#"};
const pidNS: rdfNameSpace = {prefix: "pid:", path: "http://example.org/pid#"};
const foafNS: rdfNameSpace = {prefix: "foaf:", path: "http://xmlns.com/foaf/0.1#"};
const orgNS: rdfNameSpace = {prefix: "org:", path: "http://www.w3.org/ns/org#"};
const timeNS: rdfNameSpace = {prefix: "time:", path: "http://www.w3.org/2006/time#"};
const rdfNS: rdfNameSpace = {prefix: "rdf:", path: "http://www.w3.org/1999/02/22-rdf-syntax-ns#"};
const rdfsNS: rdfNameSpace = {prefix: "rdfs:", path: "http://www.w3.org/2001/XMLSchema#"};
const xsdNS: rdfNameSpace = {prefix: "xsd:", path: "http://www.w3.org/2000/01/rdf-schema#"};


function organizationaRdfGenerator(employee:Employee): Promise<string> {
/*
    const writer = new Writer({ prefixes: { '': 'http://example.org/id#',
                                            pid: 'http://example.org/pid#',
                                            foaf: 'http://xmlns.com/foaf/0.1#',
                                            org: 'http://www.w3.org/ns/org#',
                                            time: 'http://www.w3.org/2006/time#',
                                            rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'} });
*/
    const writer = new Writer({ prefixes: { '': 'http://example.org/id#',
                                            pid: 'http://example.org/pid#',
                                            foaf: 'http://xmlns.com/foaf/0.1#',
                                            org: 'http://www.w3.org/ns/org#',
                                            time: 'http://www.w3.org/2006/time#',
                                            rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
                                            rdfs: 'http://www.w3.org/2001/XMLSchema#',
                                            xsd: 'http://www.w3.org/2000/01/rdf-schema#'} });



    const staffRoleNode: NamedNode<string> = namedNode(idNS.prefix + 'staff-role');
    const avpRoleNode: NamedNode<string> = namedNode(idNS.prefix + 'avp-role');
    const vpRoleNode: NamedNode<string> = namedNode(idNS.prefix + 'vp-role');
    const dirRoleNode: NamedNode<string> = namedNode(idNS.prefix + 'dir-role');
    const mdrRoleNode: NamedNode<string> = namedNode(idNS.prefix + 'mdr-role');

    writer.addQuads([
        triple(staffRoleNode, namedNode(rdfNS.path + 'type'), namedNode(orgNS.prefix + 'Role')),
        triple(staffRoleNode, namedNode(rdfsNS.path + 'label'), literal('Staff')),
        triple(avpRoleNode, namedNode(rdfNS.path + 'type'), namedNode(orgNS.prefix + 'Role')),
        triple(avpRoleNode, namedNode(rdfsNS.path + 'label'), literal('AVP')),
        triple(vpRoleNode, namedNode(rdfNS.path + 'type'), namedNode(orgNS.prefix + 'Role')),
        triple(vpRoleNode, namedNode(rdfsNS.path + 'label'), literal('VP')),
        triple(dirRoleNode, namedNode(rdfNS.path + 'type'), namedNode(orgNS.prefix + 'Role')),
        triple(dirRoleNode, namedNode(rdfsNS.path + 'label'), literal('DIR')),
        triple(mdrRoleNode, namedNode(rdfNS.path + 'type'), namedNode(orgNS.prefix + 'Role')),
        triple(mdrRoleNode, namedNode(rdfsNS.path + 'label'), literal('MDR')),
    ])

    const personNodeName: string = idNS.prefix + employee.employee_id;
    const personNode = namedNode(personNodeName.toLowerCase());
    writer.addQuads([
        triple(personNode, namedNode(rdfNS.path + 'type'), namedNode(foafNS.prefix + 'Person')),
        triple(personNode, namedNode(pidNS.prefix + 'pid'),literal(employee.employee_id)),
        triple(personNode, namedNode(foafNS.prefix + 'firstName'), literal(employee.firstName)),
        triple(personNode, namedNode(foafNS.prefix + 'surname'), literal(employee.secondName))
    ]);
    
    /*
    const organizationNodeName: string = idNS.prefix + employee.department + "-organization";
    const organizationNode = namedNode(organizationNodeName.toLowerCase());
    writer.addQuads([
        triple(organizationNode, namedNode(rdfNS.path + 'type'), namedNode(orgNS.prefix + 'FormalOrganization')),
        triple(organizationNode, namedNode(orgNS.prefix + 'name'),literal(employee.department))
    ]);
    */

    const organizationNode = createSubOrganizations(employee.department, writer);

    // set up the membership and time interval
    const organizationMembershipNodeName: string = (idNS.prefix + employee.employee_id + "-" + employee.department + "-membership").toLocaleLowerCase();
    const organizationMembershipNode = namedNode(organizationMembershipNodeName);
    const organizationMembershipTimeIntervalNodeName: string = (organizationMembershipNodeName + "-timeinterval").toLocaleLowerCase();
    const organizationMembershipTimeIntervalNode = namedNode(organizationMembershipTimeIntervalNodeName);
    const organizationMembershipTimeIntervalStartDateNodeName: string = (organizationMembershipNodeName + "-start").toLocaleLowerCase();
    const organizationMembershipTimeIntervalStartDateNode = namedNode(organizationMembershipTimeIntervalStartDateNodeName);
    const organizationMembershipTimeIntervalEndDateNodeName: string = (organizationMembershipNodeName + "-end").toLocaleLowerCase();
    const organizationMembershipTimeIntervalEndDateNode = namedNode(organizationMembershipTimeIntervalEndDateNodeName);
    
    writer.addQuads([
        triple(organizationMembershipNode, namedNode(rdfNS.path + 'type'), namedNode(orgNS.prefix + 'Membership')),
        triple(organizationMembershipNode, namedNode(orgNS.prefix + 'member'), personNode),
        triple(organizationMembershipNode, namedNode(orgNS.prefix + 'organization'), organizationNode),
        triple(organizationMembershipNode, namedNode(orgNS.prefix + 'memberDuring'), organizationMembershipTimeIntervalNode),
    ]);

    writer.addQuads([
        triple(organizationMembershipTimeIntervalNode, namedNode(rdfNS.path + 'type'), namedNode(timeNS.prefix + 'Interval')),
        triple(organizationMembershipTimeIntervalNode, namedNode(timeNS.prefix + 'hasBeginning'), organizationMembershipTimeIntervalStartDateNode),
        triple(organizationMembershipTimeIntervalNode, namedNode(timeNS.prefix + 'hasEnd'), organizationMembershipTimeIntervalEndDateNode)
    ]);

    const employeeStartDate: string = (new Date(employee.departmentStartDate)).toISOString() + "^^xsd:dateTime";
    writer.addQuads([
        triple(organizationMembershipTimeIntervalStartDateNode, namedNode(rdfNS.path + 'type'), namedNode(timeNS.prefix + 'hasBeginning')),
        triple(organizationMembershipTimeIntervalStartDateNode, namedNode(timeNS.prefix + 'inXSDDateTime'), literal(employeeStartDate))
    ]);

    const employeeEndDate: string = (new Date(employee.departmentEndDate)).toISOString() + "^^xsd:dateTime";
    writer.addQuads([
        triple(organizationMembershipTimeIntervalEndDateNode, namedNode(rdfNS.path + 'type'), namedNode(timeNS.prefix + 'hasEnd')),
        triple(organizationMembershipTimeIntervalEndDateNode, namedNode(timeNS.prefix + 'inXSDDateTime'), literal(employeeEndDate))
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
    const corpTitleMembershipTimeIntervalStartDateName: string = (corpTitleMembershipName + "-start").toLocaleLowerCase();
    const corpTitleMembershipTimeIntervalStartDateNode = namedNode(corpTitleMembershipTimeIntervalStartDateName);
    const corpTitleMembershipTimeIntervalEndDateName: string = (corpTitleMembershipName + "-end").toLocaleLowerCase();
    const corpTitleMembershipTimeIntervalEndDateNode = namedNode(corpTitleMembershipTimeIntervalEndDateName);
    
    // corporate title membership
    writer.addQuads([
        triple(coprTitleMembershipNode, namedNode(rdfNS.path + 'type'), namedNode(orgNS.prefix + 'Membership')),
        triple(coprTitleMembershipNode, namedNode(orgNS.prefix + 'member'), personNode),
        triple(coprTitleMembershipNode, namedNode(orgNS.prefix + 'role'), corporateTitleNode),
        triple(coprTitleMembershipNode, namedNode(orgNS.prefix + 'memberDuring'), corpTitleMembershipTimeIntervalNode),
    ]);

    // corporate title membership time interval
    writer.addQuads([
        triple(corpTitleMembershipTimeIntervalNode, namedNode(rdfNS.path + 'type'), namedNode(timeNS.prefix + 'Interval')),
        triple(corpTitleMembershipTimeIntervalNode, namedNode(timeNS.prefix + 'hasBeginning'), corpTitleMembershipTimeIntervalStartDateNode),
        triple(corpTitleMembershipTimeIntervalNode, namedNode(timeNS.prefix + 'hasEnd'), corpTitleMembershipTimeIntervalEndDateNode)
    ]);

    const corpTitleStartDate: string = (new Date(employee.departmentStartDate)).toISOString() + "^^xsd:dateTime";
    writer.addQuads([
        triple(corpTitleMembershipTimeIntervalStartDateNode, namedNode(rdfNS.path + 'type'), namedNode(timeNS.prefix + 'hasBeginning')),
        triple(corpTitleMembershipTimeIntervalStartDateNode, namedNode(timeNS.prefix + 'inXSDDateTime'), literal(corpTitleStartDate))
    ]);

    const corpTitleEndDate: string = (new Date(employee.departmentEndDate)).toISOString() + "^^xsd:dateTime";
    writer.addQuads([
        triple(corpTitleMembershipTimeIntervalEndDateNode, namedNode(rdfNS.path + 'type'), namedNode(timeNS.prefix + 'hasEnd')),
        triple(corpTitleMembershipTimeIntervalEndDateNode, namedNode(timeNS.prefix + 'inXSDDateTime'), literal(corpTitleEndDate))
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

export default organizationaRdfGenerator;