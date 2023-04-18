import { plainToClass } from "class-transformer";
import { ConfigurationManager } from "../ConfigurationManager";
import { BackEndConfiguration, BackEndDBConfiguration } from "../models/eom/configuration/BackEndConfiguration";
import { IRdfGraphDB } from "./IRdfGraphDB";
import { BlazeGraphDB, BlazeGraphDBOptions } from "./blazegraph/BlazeGraphDB";
import { OnToTextGraphDB } from "./graphdb/OnToTextGraphDB";

class GraphPersistenceFactory {
    private static singleton: GraphPersistenceFactory;
    private graphDB: IRdfGraphDB;

    constructor (graphDB: IRdfGraphDB) {
        this.graphDB = graphDB;
    }

    public static getInstance(): GraphPersistenceFactory {
        if (GraphPersistenceFactory.singleton == null) {
            console.log("GraphPersistenceFactory is NULL")
            const bec = ConfigurationManager.getInstance().getApplicationConfiguration().getBackEndConfiguration();
            console.log(bec);
            const bedbc:BackEndDBConfiguration = bec.getGraphDBConfiguration(bec.getGraphDB())! as BackEndDBConfiguration;
            console.log(bedbc);
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