import { Type } from "class-transformer";
import { BackEndConfiguration } from "./BackEndConfiguration";
import { FrontEndConfiguration } from "./FrontEndConfiguration";

class ApplicationConfiguration {
    @Type(() => FrontEndConfiguration)
    frontend: FrontEndConfiguration;
    @Type(() => BackEndConfiguration)
    backend: BackEndConfiguration;

    constructor(frontend: FrontEndConfiguration, backend: BackEndConfiguration) {
        this.frontend = frontend;
        this.backend = backend;
    }

    public getFrontEndConfiguration(): FrontEndConfiguration {
        return this.frontend;
    }

    public getBackEndConfiguration(): BackEndConfiguration {
        return this.backend;
    }
}

const defaultApplicationConfiguration = new ApplicationConfiguration(new FrontEndConfiguration(), new BackEndConfiguration());

export { ApplicationConfiguration, defaultApplicationConfiguration }