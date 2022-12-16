import { write } from "fs";
import { Writer, DataFactory } from "n3";

const { namedNode, literal, defaultGraph, quad, triple } = DataFactory;

import EmployeeRecord from "../models/EmployeeRecord";

function organizationaRdfGenerator(employee:EmployeeRecord): void {
    const writer = new Writer({ prefixes: { '': 'http://example.org/id#',
                                            pid: 'http://example.org/pid#',
                                            foaf: 'http://xmlns.com/foaf/0.1#',
                                            org: 'http://www.w3.org/ns/org#',
                                            time: 'http://www.w3.org/2006/time#',
                                            rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'} });

    const personNodeName: string = "http://example.org/id#" + employee.id;
    const personNode = namedNode(personNodeName.toLowerCase());
    writer.addQuads([
        triple(personNode, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('foaf:Person')),
        triple(personNode, namedNode('pid:pid'),literal(employee.id)),
        triple(personNode, namedNode('foaf:giveName'), literal(employee.firstName)),
        triple(personNode, namedNode('foaf:f'), literal(employee.firstName))
    ]);
    
    const organizationNodeName: string = "http://example.org/id#" + employee.department + "-organization";
    const organizationNode = namedNode(organizationNodeName.toLowerCase());
    writer.addQuads([
        triple(organizationNode, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('org:FormalOrganization')),
        triple(organizationNode, namedNode('org:name'),literal(employee.department))
    ]);


    writer.end((error, result) => console.log(result));
}

export default organizationaRdfGenerator;