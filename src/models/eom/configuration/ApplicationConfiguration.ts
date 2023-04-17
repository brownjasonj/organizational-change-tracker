import { BackEndConfiguration } from "./BackEndConfiguration";
import { FrontEndConfiguration } from "./FrontEndConfiguration";

class ApplicationConfiguration {
    private frontEndConfigutation: FrontEndConfiguration;
    private backEndConfiguration: BackEndConfiguration;

    constructor(frontend: FrontEndConfiguration, backend: BackEndConfiguration) {
        this.frontEndConfigutation = frontend;
        this.backEndConfiguration = backend;
    }

    public getFrontEndConfiguration(): FrontEndConfiguration {
        return this.frontEndConfigutation;
    }

    public getBackEndConfiguration(): BackEndConfiguration {
        return this.backEndConfiguration;
    }
}

const defaultApplicationConfiguration = new ApplicationConfiguration(new FrontEndConfiguration(), new BackEndConfiguration());

export { ApplicationConfiguration, defaultApplicationConfiguration }