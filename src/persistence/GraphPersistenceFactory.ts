import { IRdfGraphDB } from "../interfaces/IRdfGraphDB";
import { BlazeGraph, BlazeGraphOptions } from "./blazegraph/BlazeGraph";
import { OnToTextGraphDB } from "./graphdb/OnToTextGraphDB";

class GraphPersistenceFactory {
    private static graphDB: IRdfGraphDB;

    static {
        // To use the OnToTextGraphDB, uncomment the following line and comment out the BlazeGraph line
        // GraphPersistenceFactory.graphDB = new OnToTextGraphDB();

        // To use the BlazeGraph, uncomment the following line and comment out the OnToTextGraphDB line
        const blazeGraphOptions: BlazeGraphOptions = new BlazeGraphOptions({});
        GraphPersistenceFactory.graphDB = new BlazeGraph(new BlazeGraphOptions({}));
    }

    static getGraphDB(): IRdfGraphDB {
        return GraphPersistenceFactory.graphDB;
    }
}

export { GraphPersistenceFactory };