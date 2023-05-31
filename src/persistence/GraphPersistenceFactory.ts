import { plainToClass } from "class-transformer";
import { BackEndConfiguration, BackEndDBConfiguration } from "../models/eom/configuration/BackEndConfiguration";
import { IRdfGraphDB } from "./IRdfGraphDB";
import { BlazeGraphDB, BlazeGraphDBOptions } from "./blazegraph/BlazeGraphDB";
import { consoleLogger } from "../logging/consoleLogger";

class GraphPersistenceFactory {
    private static singleton: GraphPersistenceFactory | undefined = undefined;
    private static backEndConfiguration: BackEndConfiguration | undefined = undefined;
    private graphDB: IRdfGraphDB;

    constructor (graphDB: IRdfGraphDB) {
        this.graphDB = graphDB;
    }

    public static setBackEndConfiguration(backEndConfiguration: BackEndConfiguration) {
        if (!GraphPersistenceFactory.singleton) {
            GraphPersistenceFactory.backEndConfiguration = backEndConfiguration;
        }
        else {
            throw new Error("GraphPersistenceFactory already instantiated");
        }
    }

    public static getInstance(): GraphPersistenceFactory {
        if (!GraphPersistenceFactory.singleton) {
            consoleLogger.info("GraphPersistenceFactory is NULL")
            if (GraphPersistenceFactory.backEndConfiguration) {
                // const bec = ConfigurationManager.getInstance().getApplicationConfiguration().getBackEndConfiguration();
                // consoleLogger.info(bec);
                const backEndDBConfiguration:BackEndDBConfiguration = GraphPersistenceFactory.backEndConfiguration.getGraphDBConfiguration(GraphPersistenceFactory.backEndConfiguration.getGraphDB())! as BackEndDBConfiguration;
                consoleLogger.info(backEndDBConfiguration);
                switch(backEndDBConfiguration.getType()) {
                    case "blazegraph":
                    default:
                        GraphPersistenceFactory.singleton = new GraphPersistenceFactory(new BlazeGraphDB(GraphPersistenceFactory.backEndConfiguration, plainToClass(BlazeGraphDBOptions, backEndDBConfiguration)));
                        break;
                }
            }
            else {
                throw new Error("BackEndConfiguration is undefined!");
            }
        }
        return GraphPersistenceFactory.singleton;
    }

    getGraphDB(): IRdfGraphDB {
        return this.graphDB;
    }
}

export { GraphPersistenceFactory };