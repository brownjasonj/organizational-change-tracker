import { Logger } from "pino";
import { GraphPersistenceFactory } from "../persistence/GraphPersistenceFactory";
import { IRdfGraphDB } from "../persistence/IRdfGraphDB";
import { RdfCompliantBackend } from "./RdfCompliantBackend";

class BlazeGraphRdfQuery extends RdfCompliantBackend {
    constructor(graphDB: IRdfGraphDB, logger: Logger) {
        super(GraphPersistenceFactory.getInstance().getGraphDB(), logger);
    }
}

export { BlazeGraphRdfQuery }