<h1>Overview</h1>
<p>
The objective of this project is to explore the use of knowledge graph for tracking the evolution (over time) of corporations internal organizational structure.  It leverages open standards such as RDF (turtle dialect) and SPARQL for the data representation and querying, existing ontologies for the semantic encoding and typescript/javascript popular libraries (e.g., n3) for manipulating the semantic triples.
<p>

<p>
Trying to stick to standards as much as possible is a key tenat of the project. I have been experimenting with Neo4j, Blazegraph and OntoText GraphDB.
</p>

<p>
<h3>
GraphDB (<a href="https://www.ontotext.com/">OnToText</a>)
</h3>
So far this has been the most standard version of an RDF triple store that I have experimented with.
</p>

<h3>
Blazegraph
</h3>
Download the latest version of blazegraph <a href="">here</a>.  There are are several command line arguments, port setting is perhaps one you might need:

<p>
<code>
    java -server -Xmx64g -jar blazegraph.jar
</code>

<code>
    java -server -Xmx64g -Djetty.port=19999 -jar blazegraph.jar
</code>
</p>
Blazegraph doesn't appear to support <code>xsd:dateTimeStamp</code> which is the replacement for <code>xsd:dateTime</code> (which is being depricated).  The RDF mapper in this project is using the latter in order that it will work on both blazegraph and Ontotext GraphDB.
</p>

<p>
<h3> AWS Neptune</h3>
AWS are offering a blazegraph serverless solution called Neptune. I haven't yet tried this, but am eager to see if the aforementioned problems i'm having with Blazegraph have been solved. I assume so, but need to check.

Once I get around to it I'll push terraform code to create Neptune store so that you can run the same example against that triple store.
</p>

<p>
<h3>
NEO4J
</h3>
We have experimented extensively with Neo4j which is popular, however have found that the neosemantic module isn't mature enough, particularly in the handling of namespaces.  Furthetmore, there is no current support for SPARQL as the company has it's own query language (Cypher).  However, this project does containt examples of Cypher, but it is more complex than using SPARQL queries (compare the <a href="https://github.com/brownjasonj/organizational-change-tracker/blob/main/rdf-examples/sample-cypher.cql">sample-cypher.cql</a> and <a href="https://github.com/brownjasonj/organizational-change-tracker/blob/main/rdf-examples/sample-sparql.rq">sample sample-sparql.rq</a> files to see what we mean).
</p>


<h1> Graph DB Installations</h1>
You can find all necessary instructions on installing the various triple stores, but just in case here is a simple index into them.

<h2> OnToText GraphDB </h2>
Go to <a href="https://www.ontotext.com/">OnToText</a> for the desktop version of their triple store.  Unfortuantely you'll have to leave you details and email address to get the download, but after that it is free to use for your experiments.

<h2>Blazegraph Setup</h2>
For set up got to <a href="https://github.com/blazegraph/database/wiki/Main_Page">Blazegraph Quickstart</a>.

<h2>NEO4J Setup</h2>

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


<h2> HTTPS Certificate Set-up</h2>
To enable support for HTTPS you'll need to set up server certificates and then point to them from the index.ts file.

<code>
openssl genrsa -out key.pem
</code>

<code>
openssl req -new -key key.pem -out csr.pem
</code>

<code>
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
</code>

