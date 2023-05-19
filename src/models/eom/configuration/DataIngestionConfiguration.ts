

class DataIngestionConfiguration {
    temporaryDirectory: string;
    ontologyValidation: boolean;
    ontologyValidationSchemaPath: string;

    constructor() {
        this.temporaryDirectory = './tmp/';
        this.ontologyValidation = false;
        this.ontologyValidationSchemaPath = './rdf/ontology/bank-organization.ttl';
    }

    public getTemporaryDirectory(): string {
        return this.temporaryDirectory;
    }

    public getOntologyValidation(): boolean {
        return this.ontologyValidation;
    }

    public getOntologyValidationSchemaPath(): string {
        return this.ontologyValidationSchemaPath;
    }
}

export { DataIngestionConfiguration }