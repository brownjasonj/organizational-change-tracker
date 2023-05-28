import { Logger } from "pino";
import { RdfOntologyConfiguration } from "../models/eom/configuration/RdfOntologyConfiguration";
import { GraphPersistenceFactory } from "../persistence/GraphPersistenceFactory";
import { IRdfGraphDB } from "../persistence/IRdfGraphDB";
import { RdfCompliantBackend } from "./RdfCompliantBackend";

class BlazeGraphRdfQuery extends RdfCompliantBackend {
    constructor(rdfOntologyDefinitions: RdfOntologyConfiguration, graphDB: IRdfGraphDB, logger: Logger) {
        super(rdfOntologyDefinitions, GraphPersistenceFactory.getInstance().getGraphDB(), logger);
    }
}

export { BlazeGraphRdfQuery }