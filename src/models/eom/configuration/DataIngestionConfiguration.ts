

class DataIngestionConfiguration {
    temporaryDirectory: string;
    ontologyValidation: boolean;
    ontologyValidationSchemaPath: string;
    ontologyValidationSchemaFormat: string;
    deleteTemporaryFiles: boolean;

    constructor() {
        this.temporaryDirectory = './tmp/';
        this.ontologyValidation = false;
        this.ontologyValidationSchemaPath = './rdf/ontology/bank-organization.ttl';
        this.ontologyValidationSchemaFormat = 'test/turtle';
        this.deleteTemporaryFiles = true;
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

    public getDeleteTemporaryFiles(): boolean {
        return this.deleteTemporaryFiles;
    }
}

export { DataIngestionConfiguration }