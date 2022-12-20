<h1>Overview</h1>
<p>
The objective of this project is to explore the use of knowledge graph for tracking the evolution (over time) of corporations internal organizational structure.  It leverages open standards such as RDF (turtle dialect) and SPARQL for the data representation and querying, existing ontologies for the semantic encoding and typescript/javascript popular libraries (e.g., n3) for manipulating the semantic triples.
<p>

<p>
Trying to stick to standards as much as possible is a key tenat of the project.  As such we currently recommend using Blazegraph as it readily supports RDF Turtle and SPARQL.  Furthermore it is very easy to set up.

We have experimented extensively with Neo4j which is popular, however have found that the neosemantic module isn't mature enough, particularly in the handling of namespaces.  Furthetmore, there is no current support for SPARQL as the company has it's own query language (Cypher).  However, this project does containt examples of Cypher, but it is more complex than using SPARQL queries (compare the <a href="https://github.com/brownjasonj/organizational-change-tracker/blob/main/rdf-examples/sample-cypher.cql">sample-cypher.cql</a> and <a href="https://github.com/brownjasonj/organizational-change-tracker/blob/main/rdf-examples/sample-sparql.rq">sample sample-sparql.rq</a> files to see what we mean).
</p>

<h1>Blazegraph Setup</h1>
For set up got to <a href="https://github.com/blazegraph/database/wiki/Main_Page">Blazegraph Quickstart</a>.

<h1>NEO4J Setup</h1>

1. Install Neo4j Desktop (<a href="https://neo4j.com/docs/desktop-manual/current/installation/">Neo4j Installation</a>)
2. Start Neo4j
3. Install the Neosemantics (n10s) plug-in.
    a. from the Neo4j application click on 'Open' next to you database.  this will open a browser.
    b. on the right you should see 3 tabs: Details, Plugins, Upgrade
    c. Click on Plugins tab.  You should see a list of plugins, one of which is the neosemantics plugin
    d. click install.  probably this restarts your database
4. open the neo4j browser again and you should see a prompt where you can run db commands
5. Initialize the neosemantic plugin by running the folloing command:

    <code>
        call n10s.graphconfig.init();        
    </code>

    <code>
        CREATE CONSTRAINT n10s_unique_uri ON (r:Resource)
        ASSERT r.uri IS UNIQUE;
    </code>

6. Loaded a turtle example file from the 'rdf-examples' directory as follows:

    <code>
        CALL n10s.rdf.import.fetch("file:{path to project}/rdf-examples/simple.ttl","Turtle");
    </code>

7. Display the graph by running the following:
    
    <code>
        match (n) return n;
    </code>
    

Namespaces in Neo4j
You need to added the namespaces that you will be using otherwise neo4j will just prefix ids with ns{n} for each new namespace which makes it harder to find items.  To add a namespace you need to use the command:

<code>
    CALL n10s.nsprefixes.add("neo", "http://neo4j.org/vocab/sw#");
</code>

<code>
    CALL n10s.nsprefixes.add(":", "http://example.org/id#");
    CALL n10s.nsprefixes.add("foaf:", "http://xmlns.com/foaf/0.1#");
    CALL n10s.nsprefixes.add("org:", "http://www.w3.org/ns/org#");
    CALL n10s.nsprefixes.add("time:", "http://www.w3.org/2006/time#");
    CALL n10s.nsprefixes.add("pid:", "http://example.org/pid#");
</code>

<code>
    call n10s.graphconfig.set( {
        handleRDFTypes: "LABELS_AND_NODES",
        handleMultival: "OVERWRITE",
        handleVocabUris: "KEEP"
    });
</code>

and to list which namespaces neo4j has, run this:

<code>
    call n10s.nsprefixes.list();
</code>

This project was initally created with the basic set up for a typescript node project using 
the instructions from (https://khalilstemmler.com/blogs/typescript/node-starter-project/)

