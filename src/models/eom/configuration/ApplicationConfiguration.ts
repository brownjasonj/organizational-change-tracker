import { Type } from "class-transformer";
import { BackEndConfiguration } from "./BackEndConfiguration";
import { FrontEndConfiguration } from "./FrontEndConfiguration";
import { LoggingConfiguration } from "./LoggingConfiguration";

class ApplicationConfiguration {
    @Type(() => FrontEndConfiguration)
    frontend: FrontEndConfiguration;
    @Type(() => BackEndConfiguration)
    backend: BackEndConfiguration;
    @Type(() => LoggingConfiguration)
    logging: LoggingConfiguration;

    constructor(frontend: FrontEndConfiguration, backend: BackEndConfiguration, logging: LoggingConfiguration) {
        this.frontend = frontend;
        this.backend = backend;
        this.logging = logging;
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
}

const defaultApplicationConfiguration = new ApplicationConfiguration(new FrontEndConfiguration(), new BackEndConfiguration(), new LoggingConfiguration());

export { ApplicationConfiguration, defaultApplicationConfiguration }