import { write } from "fs";
import { Writer, DataFactory } from "n3";
import { DateTime } from "neo4j-driver-core";

const { namedNode, literal, defaultGraph, quad, triple } = DataFactory;

import EmployeeRecord from "../models/EmployeeRecord";

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



function organizationaRdfGenerator(employee:EmployeeRecord, loadDate: Date): void {
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
                                            rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'} });

    const personNodeName: string = idNS.prefix + employee.id;
    const personNode = namedNode(personNodeName.toLowerCase());
    writer.addQuads([
        triple(personNode, namedNode(rdfNS.path + 'type'), namedNode(foafNS.prefix + 'Person')),
        triple(personNode, namedNode(pidNS.prefix + 'pid'),literal(employee.id)),
        triple(personNode, namedNode(foafNS.prefix + 'giveName'), literal(employee.firstName)),
        triple(personNode, namedNode(foafNS.prefix + 'surName'), literal(employee.secondName))
    ]);
    
    const organizationNodeName: string = idNS.prefix + employee.department + "-organization";
    const organizationNode = namedNode(organizationNodeName.toLowerCase());
    writer.addQuads([
        triple(organizationNode, namedNode(rdfNS.path + 'type'), namedNode(orgNS.prefix + 'FormalOrganization')),
        triple(organizationNode, namedNode(orgNS.prefix + 'name'),literal(employee.department))
    ]);

    // set up the membership and time interval
    const organizationMembershipNodeName: string = (idNS.prefix + employee.id + "-" + employee.department + "-membership").toLocaleLowerCase();
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

    const employeeStartDate: string = (new Date(employee.startDate)).toISOString() + "^^xsd:dateTime";
    writer.addQuads([
        triple(organizationMembershipTimeIntervalStartDateNode, namedNode(rdfNS.path + 'type'), namedNode(timeNS.prefix + 'hasBeginning')),
        triple(organizationMembershipTimeIntervalStartDateNode, namedNode(timeNS.prefix + 'inXSDDateTime'), literal(employeeStartDate))
    ]);

    const employeeEndDate: string = loadDate.toISOString() + "^^xsd:dateTime";
    writer.addQuads([
        triple(organizationMembershipTimeIntervalEndDateNode, namedNode(rdfNS.path + 'type'), namedNode(timeNS.prefix + 'hasEnd')),
        triple(organizationMembershipTimeIntervalEndDateNode, namedNode(timeNS.prefix + 'inXSDDateTime'), literal(employeeEndDate))
    ]);

    // Corporate Title Role Membership (e.g., Staff, Asoociate VP, VP, Director, Managing Director, etc.)
    const corpTitleName: string = idNS.prefix + employee.jobTitle + "-corporatetitle";
    const corpTitleNode = namedNode(corpTitleName.toLowerCase());
    writer.addQuads([
        triple(corpTitleNode, namedNode(rdfNS.path + 'type'), namedNode(orgNS.prefix + 'Role')),
        triple(corpTitleNode, namedNode(rdfsNS.prefix + 'roleName'),literal(employee.jobTitle))
    ]);


    const corpTitleMembershipName: string = (idNS.prefix + employee.id + "-" + employee.jobTitle + "-membership").toLocaleLowerCase();
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
        triple(coprTitleMembershipNode, namedNode(orgNS.prefix + 'organization'), organizationNode),
        triple(coprTitleMembershipNode, namedNode(orgNS.prefix + 'memberDuring'), corpTitleMembershipTimeIntervalNode),
    ]);

    // corporate title membership time interval
    writer.addQuads([
        triple(corpTitleMembershipTimeIntervalNode, namedNode(rdfNS.path + 'type'), namedNode(timeNS.prefix + 'Interval')),
        triple(corpTitleMembershipTimeIntervalNode, namedNode(timeNS.prefix + 'hasBeginning'), organizationMembershipTimeIntervalStartDateNode),
        triple(corpTitleMembershipTimeIntervalNode, namedNode(timeNS.prefix + 'hasEnd'), organizationMembershipTimeIntervalEndDateNode)
    ]);

    const corpTitleStartDate: string = (new Date(employee.startDate)).toISOString() + "^^xsd:dateTime";
    writer.addQuads([
        triple(corpTitleMembershipTimeIntervalStartDateNode, namedNode(rdfNS.path + 'type'), namedNode(timeNS.prefix + 'hasBeginning')),
        triple(corpTitleMembershipTimeIntervalStartDateNode, namedNode(timeNS.prefix + 'inXSDDateTime'), literal(corpTitleStartDate))
    ]);

    const corpTitleEndDate: string = loadDate.toISOString() + "^^xsd:dateTime";
    writer.addQuads([
        triple(corpTitleMembershipTimeIntervalEndDateNode, namedNode(rdfNS.path + 'type'), namedNode(timeNS.prefix + 'hasEnd')),
        triple(corpTitleMembershipTimeIntervalEndDateNode, namedNode(timeNS.prefix + 'inXSDDateTime'), literal(corpTitleEndDate))
    ]);



    writer.end((error, result) => console.log(result));
}

export default organizationaRdfGenerator;