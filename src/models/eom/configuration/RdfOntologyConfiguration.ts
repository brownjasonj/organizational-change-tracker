import { Expose, Transform, Type, plainToClass, plainToInstance } from "class-transformer";


class RdfNameSpace {
    prefix: string;
    path: string;

    constructor(prefix: string, path: string) {
        this.prefix = prefix;
        this.path = path;
    }
};

const bankOrgName = 'bank-org';
const bankIdName = 'bank-id';
const orgName = 'org';
const timeName = 'time';
const intervalName = 'interval';
const rdfName = 'rdf';
const rdfsName = 'rdfs';
const xsdName = 'xsd';
const foafName = 'foaf';

const defaultedPrefixes = new Map<string,string>([
    [bankOrgName, 'http://example.org/bank-org#'],
    [bankIdName, 'http://example.org/bank-id#'],
    [orgName, 'http://www.w3.org/ns/org#'],
    [timeName, 'http://www.w3.org/2006/time#'],
    [intervalName, 'http://example.org/interval#'],
    [rdfName, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'],
    [rdfsName, 'http://www.w3.org/2000/01/rdf-schema#'],
    [xsdName, 'http://www.w3.org/2001/XMLSchema#'],
    [foafName, 'http://xmlns.com/foaf/0.1#']
]);

class RdfOntologyConfiguration {
    @Transform(value => {
        let map = new Map<string, String>();
        for (let entry of Object.entries(value.value)) {
            map.set(entry[0], plainToClass(String, entry[1]));
        }
        return map;
      }, { toClassOnly: true })
    @Transform(value => {
        const trains: {[key: string]: object} = {};

        if (value && value instanceof Map) {
            for (const entry of value.entries()) {
                trains[entry[0]] = entry[1];
            }
        }
        console.log(trains);
        return trains;
      }, { toPlainOnly: true })
    prefixes: Map<string,String> = new Map();


    public getPrefixes(): Map<String,String> {
        return this.prefixes;
    }
    
    public getSparqlPrefixes(names?: string[]): string {
        let sparqlPrefixes = '';
        if (!names) {
            this.prefixes.forEach((value: String, key: String) => {
                sparqlPrefixes += `prefix ${key}: <${value}>\n`;
            });
        } else {
            names.forEach((name: string) => {
                sparqlPrefixes += `prefix ${name}: <${this.prefixes.get(name)}>\n`;
            });
        }
        return sparqlPrefixes;
    }

    public getBankOrgPrefix(): string {
        return `${bankOrgName}:`;
    }

    public getBankIdPrefix(): string {
        return `${bankIdName}:`;
    }

    public getOrgPrefix(): string {
        return `${orgName}:`;
    }

    public getTimePrefix(): string {
        return `${timeName}:`;
    }

    public getIntervalPrefix(): string {
        return `${intervalName}:`;
    }

    public getRdfPrefix(): string {
        return `${rdfName}:`
    }

    public getRdfsPrefix(): string {
        return `${rdfsName}:`;
    }

    public getXsdPrefix(): string {
        return `${xsdName}:`;
    }

    public getFoafPrefix(): string {
        return `${foafName}:`;
    }
}

export { RdfOntologyConfiguration }