import { Type } from "class-transformer";
import { BackEndConfiguration } from "./BackEndConfiguration";
import { FrontEndConfiguration } from "./FrontEndConfiguration";
import { LoggingConfiguration } from "./LoggingConfiguration";
import { RdfOntologyConfiguration } from "./RdfOntologyConfiguration";

class ApplicationConfiguration {
    @Type(() => FrontEndConfiguration)
    frontend: FrontEndConfiguration;
    @Type(() => BackEndConfiguration)
    backend: BackEndConfiguration;
    @Type(() => LoggingConfiguration)
    logging: LoggingConfiguration;
    @Type(() => RdfOntologyConfiguration)
    rdfOntologies: RdfOntologyConfiguration;

    constructor(frontend: FrontEndConfiguration, backend: BackEndConfiguration, logging: LoggingConfiguration, rdfOntologies: RdfOntologyConfiguration) {
        this.frontend = frontend;
        this.backend = backend;
        this.logging = logging;
        this.rdfOntologies = rdfOntologies;
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
}

const defaultApplicationConfiguration = new ApplicationConfiguration(new FrontEndConfiguration(), new BackEndConfiguration(), new LoggingConfiguration(), new RdfOntologyConfiguration());

export { ApplicationConfiguration, defaultApplicationConfiguration }