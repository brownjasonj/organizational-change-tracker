import * as crypto from 'crypto';
import { Writer, DataFactory, NamedNode, Quad } from "n3";

const { namedNode, literal, defaultGraph, quad, triple } = DataFactory;

import { Employee } from "../../models/eom/Employee";
import { dateIdGenerator } from "../../utils/dateIdGenerator";
import { CorporateTitle } from "../../models/eom/CorporateTitle";
import { ConfigurationManager } from "../../ConfigurationManager";
import { RdfOntologyConfiguration } from "../../models/eom/configuration/RdfOntologyConfiguration";
import { classToPlain } from "class-transformer";

function BankOrgRdfDataGenerator(writer: Writer<Quad>, rdfOntologyConfig: RdfOntologyConfiguration, employee:Employee): void { 
    const staffRoleNode: NamedNode<string> = namedNode(rdfOntologyConfig.getBankOrgPrefix() + 'StaffTitle');
    const avpRoleNode: NamedNode<string> = namedNode(rdfOntologyConfig.getBankOrgPrefix() + 'AVPTitle');
    const vpRoleNode: NamedNode<string> = namedNode(rdfOntologyConfig.getBankOrgPrefix() + 'VPTitle');
    const dirRoleNode: NamedNode<string> = namedNode(rdfOntologyConfig.getBankOrgPrefix() + 'DIRTitle');
    const mdrRoleNode: NamedNode<string> = namedNode(rdfOntologyConfig.getBankOrgPrefix() + 'MDRTitle');


    const personNodeName: string = `${rdfOntologyConfig.getEmployeeDomainIdPrefix()}${employee.employee_id}`;
    const personNode = namedNode(personNodeName.toLowerCase());
    writer.addQuads([
        triple(personNode, namedNode(rdfOntologyConfig.getRdfPrefix() + 'type'), namedNode(rdfOntologyConfig.getBankOrgPrefix() + 'BankEmployee')),
        triple(personNode, namedNode(rdfOntologyConfig.getBankOrgPrefix() + 'id'),literal(employee.employee_id)),
        triple(personNode, namedNode(rdfOntologyConfig.getBankOrgPrefix() + 'pid'),literal(employee.system_id)),
        triple(personNode, namedNode(rdfOntologyConfig.getFoafPrefix() + 'firstName'), literal(employee.firstName)),
        triple(personNode, namedNode(rdfOntologyConfig.getFoafPrefix() + 'surname'), literal(employee.secondName))
    ]);
    
    const organizationNode = createSubOrganizations(employee.department, writer);

    // set up the membership and time interval
    const organizationMembershipNodeName: string = (rdfOntologyConfig.getMembershipDomainIdPrefix() + getHashedIdFromIdName(employee.employee_id + "-" + employee.department + "-membership")).toLocaleLowerCase();
    const organizationMembershipNode = namedNode(organizationMembershipNodeName);

    const organizationMembershipTimeIntervalNodeName: string = (rdfOntologyConfig.getTimeIntervalDomainIdPrefix() + getHashedIdFromIdName(employee.employee_id + "-" + employee.department + "-membership-timeinterval")).toLocaleLowerCase();
    const organizationMembershipTimeIntervalNode = namedNode(organizationMembershipTimeIntervalNodeName);
    
    writer.addQuads([
        triple(organizationMembershipNode, namedNode(rdfOntologyConfig.getRdfPrefix() + 'type'), namedNode(rdfOntologyConfig.getBankOrgPrefix() + 'BankEmployeeOrganizationalEntityMembership')),
        triple(organizationMembershipNode, namedNode(rdfOntologyConfig.getOrgPrefix() + 'member'), personNode),
        triple(organizationMembershipNode, namedNode(rdfOntologyConfig.getOrgPrefix() + 'organization'), organizationNode),
        triple(organizationMembershipNode, namedNode(rdfOntologyConfig.getOrgPrefix() + 'memberDuring'), organizationMembershipTimeIntervalNode),
    ]);



    // Form time for the starting and ending of the duration.  The time is formed as an xsdDateTimeInstant and name of the 
    // node identifying the time is an id with a name of the form YYYYMMDDhhmmss, unique to the precision of seconds.  thousanths 
    // of a second are ignored
    const deparmentStartDateId: string = dateIdGenerator(new Date(employee.departmentStartDate));
    const departmentEndDateId: string = dateIdGenerator(new Date(employee.departmentEndDate));

    const organizationMembershipTimeIntervalStartDateNodeName: string = (rdfOntologyConfig.getTimeDomainIdPrefix() + deparmentStartDateId).toLocaleLowerCase();
    const organizationMembershipTimeIntervalStartDateNode = namedNode(organizationMembershipTimeIntervalStartDateNodeName);
    const organizationMembershipTimeIntervalEndDateNodeName: string = (rdfOntologyConfig.getTimeDomainIdPrefix() + departmentEndDateId).toLocaleLowerCase();
    const organizationMembershipTimeIntervalEndDateNode = namedNode(organizationMembershipTimeIntervalEndDateNodeName);

    writer.addQuads([
        triple(organizationMembershipTimeIntervalNode, namedNode(rdfOntologyConfig.getRdfPrefix() + 'type'), namedNode(rdfOntologyConfig.getBankOrgPrefix() + 'MembershipDuration')),
        triple(organizationMembershipTimeIntervalNode, namedNode(rdfOntologyConfig.getTimePrefix() + 'hasBeginning'), organizationMembershipTimeIntervalStartDateNode),
        triple(organizationMembershipTimeIntervalNode, namedNode(rdfOntologyConfig.getTimePrefix() + 'hasEnd'), organizationMembershipTimeIntervalEndDateNode)
    ]);
    writer.addQuads([
        triple(organizationMembershipTimeIntervalStartDateNode, namedNode(rdfOntologyConfig.getRdfPrefix() + 'type'), namedNode(rdfOntologyConfig.getBankOrgPrefix() + 'xsdDateTimeInstant')),
        triple(organizationMembershipTimeIntervalStartDateNode, namedNode(rdfOntologyConfig.getTimePrefix() + 'inXSDDateTimeStamp'), literal(employee.departmentStartDate.toISOString(),namedNode("xsd:dateTime"))),
    ]);

    writer.addQuads([
        triple(organizationMembershipTimeIntervalEndDateNode, namedNode(rdfOntologyConfig.getRdfPrefix() + 'type'), namedNode(rdfOntologyConfig.getBankOrgPrefix() + 'xsdDateTimeInstant')),
        triple(organizationMembershipTimeIntervalEndDateNode, namedNode(rdfOntologyConfig.getTimePrefix() + 'inXSDDateTimeStamp'), literal(employee.departmentEndDate.toISOString(), namedNode("xsd:dateTime"))),
    ]);

    // Corporate Title Role Membership (e.g., Staff, Asoociate VP, VP, Director, Managing Director, etc.)

    var corporateTitleNode: NamedNode;
    var jobTitleName;
    switch (employee.jobTitle) {
        case CorporateTitle.Staff:
            corporateTitleNode = staffRoleNode;
            jobTitleName = "Staff";
            break;
        case CorporateTitle.AVP:
            corporateTitleNode = avpRoleNode;
            jobTitleName = "AVP";
            break;
        case CorporateTitle.VP:
            jobTitleName = "VP";
            corporateTitleNode = vpRoleNode;
            break;
        case CorporateTitle.DIR:
            jobTitleName = "DIR";
            corporateTitleNode = dirRoleNode;
            break;
        case CorporateTitle.MDR:
            jobTitleName = "MDR";
            corporateTitleNode = mdrRoleNode;
            break;
        default:
            corporateTitleNode = staffRoleNode;
            jobTitleName = "Staff";
            break;
    }

    const corpTitleMembershipName: string = (rdfOntologyConfig.getMembershipDomainIdPrefix() + getHashedIdFromIdName(employee.employee_id + "-" + jobTitleName + "-membership")).toLocaleLowerCase();
    const coprTitleMembershipNode = namedNode(corpTitleMembershipName);
    const corpTitleMembershipTimeIntervalName: string = (rdfOntologyConfig.getTimeIntervalDomainIdPrefix() + getHashedIdFromIdName(employee.employee_id + "-" + jobTitleName + "-membership-timeinterval")).toLocaleLowerCase();
    const corpTitleMembershipTimeIntervalNode = namedNode(corpTitleMembershipTimeIntervalName);
    
    // corporate title membership
    writer.addQuads([
        triple(coprTitleMembershipNode, namedNode(rdfOntologyConfig.getRdfPrefix() + 'type'), namedNode(rdfOntologyConfig.getBankOrgPrefix() +  'BankEmployeeCorporateTitleMembership')),
        triple(coprTitleMembershipNode, namedNode(rdfOntologyConfig.getOrgPrefix() + 'member'), personNode),
        triple(coprTitleMembershipNode, namedNode(rdfOntologyConfig.getBankOrgPrefix() + 'BankCorporateTitle'), corporateTitleNode),
        triple(coprTitleMembershipNode, namedNode(rdfOntologyConfig.getOrgPrefix() + 'memberDuring'), corpTitleMembershipTimeIntervalNode),
    ]);

    const corpTitleStartDateId: string = dateIdGenerator(new Date(employee.departmentStartDate));
    const corpTitleEndDateId: string = dateIdGenerator(new Date(employee.departmentEndDate));
    const corpTitleMembershipTimeIntervalStartDateName: string = (rdfOntologyConfig.getTimeDomainIdPrefix() + corpTitleStartDateId).toLocaleLowerCase();
    const corpTitleMembershipTimeIntervalStartDateNode = namedNode(corpTitleMembershipTimeIntervalStartDateName);
    const corpTitleMembershipTimeIntervalEndDateName: string = (rdfOntologyConfig.getTimeDomainIdPrefix() + corpTitleEndDateId).toLocaleLowerCase();
    const corpTitleMembershipTimeIntervalEndDateNode = namedNode(corpTitleMembershipTimeIntervalEndDateName);


    // corporate title membership time interval
    writer.addQuads([
        triple(corpTitleMembershipTimeIntervalNode, namedNode(rdfOntologyConfig.getRdfPrefix() + 'type'), namedNode(rdfOntologyConfig.getBankOrgPrefix() + 'MembershipDuration')),
        triple(corpTitleMembershipTimeIntervalNode, namedNode(rdfOntologyConfig.getTimePrefix() + 'hasBeginning'), corpTitleMembershipTimeIntervalStartDateNode),
        triple(corpTitleMembershipTimeIntervalNode, namedNode(rdfOntologyConfig.getTimePrefix() + 'hasEnd'), corpTitleMembershipTimeIntervalEndDateNode)
    ]);

    writer.addQuads([
        triple(corpTitleMembershipTimeIntervalStartDateNode, namedNode(rdfOntologyConfig.getRdfPrefix() + 'type'), namedNode(rdfOntologyConfig.getBankOrgPrefix() + 'xsdDateTimeInstant')),
        triple(corpTitleMembershipTimeIntervalStartDateNode, namedNode(rdfOntologyConfig.getTimePrefix() + 'inXSDDateTimeStamp'), literal(employee.departmentStartDate.toISOString(), namedNode("xsd:dateTime"))),
    ]);

    writer.addQuads([
        triple(corpTitleMembershipTimeIntervalEndDateNode, namedNode(rdfOntologyConfig.getRdfPrefix() + 'type'), namedNode(rdfOntologyConfig.getBankOrgPrefix() + 'xsdDateTimeInstant')),
        triple(corpTitleMembershipTimeIntervalEndDateNode, namedNode(rdfOntologyConfig.getTimePrefix() + 'inXSDDateTimeStamp'), literal(employee.departmentEndDate.toISOString(), namedNode("xsd:dateTime"))),
    ]);

    // writer.end((error, result) => console.log(result));

    
}

function MapEmployeesToBankRdfOntologyTurtle(employees:Employee[]): Promise<string> {
    const rdfOntologyConfig: RdfOntologyConfiguration = ConfigurationManager.getInstance().getApplicationConfiguration().getRdfOntologyConfiguration();

    const writer = new Writer({ prefixes: classToPlain(rdfOntologyConfig.getPrefixes()) });

    employees.forEach((employee: Employee) => {
        BankOrgRdfDataGenerator(writer, rdfOntologyConfig, employee);
    });

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
    const rdfOntologyConfig: RdfOntologyConfiguration = ConfigurationManager.getInstance().getApplicationConfiguration().getRdfOntologyConfiguration();
    const departmentHierarchy: string[] = getDepartmentCodeHierarchy(organization).reverse();
    var departmentNodeNames: NamedNode<string>[] = [];
    var lastDepartmentNode: NamedNode<string> | null = null;

    departmentHierarchy.forEach((department: string) => {
        const organizationNodeName: string = rdfOntologyConfig.getOrganizationIdPrefix() + department;
        const organizationNode = namedNode(organizationNodeName);
        writer.addQuads([
            triple(organizationNode, namedNode(rdfOntologyConfig.getRdfPrefix() + 'type'), namedNode(rdfOntologyConfig.getOrgPrefix() + 'FormalOrganization')),
            triple(organizationNode, namedNode(rdfOntologyConfig.getOrgPrefix() + 'name'),literal(department))
        ]);
        if (lastDepartmentNode) {
            writer.addQuads([
                triple(organizationNode, namedNode(rdfOntologyConfig.getOrgPrefix() + 'subOrganizationOf'), lastDepartmentNode)
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


function getHashedIdFromIdName(idName: string): string {
    return crypto.createHash('md5').update(idName).digest('hex');
}

export { MapEmployeesToBankRdfOntologyTurtle };