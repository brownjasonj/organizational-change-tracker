import { IRdfGraphDB } from "../interfaces/IRdfGraphDB";
import { OnToTextGraphDB } from "./graphdb/OnToTextGraphDB";


// const uri = 'neo4j://localhost:7687';
// const driver: Driver = neo4j.driver(uri, neo4j.auth.basic('neo4j', 'admin'));

// const blazeGraphOptions: BlazeGraphOptions = new BlazeGraphOptions({});
// const blazegraph: BlazeGraph = new BlazeGraph(new BlazeGraphOptions({}));

// const graphDB: GraphDB =  new GraphDB();
// graphDB.init();

class GraphPersistenceFactory {
    private static graphDB: IRdfGraphDB;

    static {
        GraphPersistenceFactory.graphDB = new OnToTextGraphDB();
    }

    static getGraphDB(): IRdfGraphDB {
        return GraphPersistenceFactory.graphDB;
    }
}

export { GraphPersistenceFactory };