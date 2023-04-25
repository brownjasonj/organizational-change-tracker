import { plainToClass } from "class-transformer";
import { ConfigurationManager } from "../ConfigurationManager";
import { BackEndConfiguration, BackEndDBConfiguration } from "../models/eom/configuration/BackEndConfiguration";
import { IRdfGraphDB } from "./IRdfGraphDB";
import { BlazeGraphDB, BlazeGraphDBOptions } from "./blazegraph/BlazeGraphDB";
import { OnToTextGraphDB } from "./graphdb/OnToTextGraphDB";
import { consoleLogger } from "../logging/consoleLogger";

class GraphPersistenceFactory {
    private static singleton: GraphPersistenceFactory;
    private graphDB: IRdfGraphDB;

    constructor (graphDB: IRdfGraphDB) {
        this.graphDB = graphDB;
    }

    public static getInstance(): GraphPersistenceFactory {
        if (GraphPersistenceFactory.singleton == null) {
            consoleLogger.info("GraphPersistenceFactory is NULL")
            const bec = ConfigurationManager.getInstance().getApplicationConfiguration().getBackEndConfiguration();
            consoleLogger.info(bec);
            const bedbc:BackEndDBConfiguration = bec.getGraphDBConfiguration(bec.getGraphDB())! as BackEndDBConfiguration;
            consoleLogger.info(bedbc);
            switch(bedbc.getType()) {
                case "blazegraph":
                default:
                    GraphPersistenceFactory.singleton = new GraphPersistenceFactory(new BlazeGraphDB(bec, plainToClass(BlazeGraphDBOptions, bedbc)));
                    break;
            }
        }
        return GraphPersistenceFactory.singleton;
    }

    getGraphDB(): IRdfGraphDB {
        return this.graphDB;
    }
}

export { GraphPersistenceFactory };