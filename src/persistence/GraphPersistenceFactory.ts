import { IRdfGraphDB } from "./IRdfGraphDB";
import { BlazeGraphDB, BlazeGraphDBOptions } from "./blazegraph/BlazeGraphDB";
import { OnToTextGraphDB } from "./graphdb/OnToTextGraphDB";

class GraphPersistenceFactory {
    private static graphDB: IRdfGraphDB;

    static {
        // To use the OnToTextGraphDB, uncomment the following line and comment out the BlazeGraph line
        // GraphPersistenceFactory.graphDB = new OnToTextGraphDB();

        // To use the BlazeGraph, uncomment the following line and comment out the OnToTextGraphDB line
        GraphPersistenceFactory.graphDB = new BlazeGraphDB(new BlazeGraphDBOptions({}));
    }

    static getGraphDB(): IRdfGraphDB {
        return GraphPersistenceFactory.graphDB;
    }
}

export { GraphPersistenceFactory };