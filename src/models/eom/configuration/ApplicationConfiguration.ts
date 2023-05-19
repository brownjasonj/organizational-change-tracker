import { Type } from "class-transformer";
import { BackEndConfiguration } from "./BackEndConfiguration";
import { FrontEndConfiguration } from "./FrontEndConfiguration";
import { LoggingConfiguration } from "./LoggingConfiguration";
import { RdfOntologyConfiguration } from "./RdfOntologyConfiguration";
import { DataIngestionConfiguration } from "./DataIngestionConfiguration";

class ApplicationConfiguration {
    @Type(() => FrontEndConfiguration)
    frontend: FrontEndConfiguration;
    @Type(() => BackEndConfiguration)
    backend: BackEndConfiguration;
    @Type(() => LoggingConfiguration)
    logging: LoggingConfiguration;
    @Type(() => RdfOntologyConfiguration)
    rdfOntologies: RdfOntologyConfiguration;
    @Type(() => DataIngestionConfiguration)
    dataIngestion: DataIngestionConfiguration;

    constructor(frontend: FrontEndConfiguration, backend: BackEndConfiguration, logging: LoggingConfiguration, rdfOntologies: RdfOntologyConfiguration, dataIngestion: DataIngestionConfiguration) {
        this.frontend = frontend;
        this.backend = backend;
        this.logging = logging;
        this.rdfOntologies = rdfOntologies;
        this.dataIngestion = dataIngestion;
    }

    public getFrontEndConfiguration(): FrontEndConfiguration {
        return this.frontend;
    }

    public getBackEndConfiguration(): BackEndConfiguration {
        return this.backend;
    }

    public getLoggingConfiguration(): LoggingConfiguration {
        return this.logging;
    }

    public getRdfOntologyConfiguration(): RdfOntologyConfiguration {
        return this.rdfOntologies;
    }

    public getDataIngestionConfiguration(): DataIngestionConfiguration {
        return this.dataIngestion;
    }
}

const defaultApplicationConfiguration = new ApplicationConfiguration(new FrontEndConfiguration(), new BackEndConfiguration(), new LoggingConfiguration(), new RdfOntologyConfiguration(), new DataIngestionConfiguration());

export { ApplicationConfiguration, defaultApplicationConfiguration }