NEO4J Setup

1. Install Neo4j Desktop (https://neo4j.com/docs/desktop-manual/current/installation/)
2. Start Neo4j
3. Install the Neosemantics (n10s) plug-in.
    a. from the Neo4j application click on 'Open' next to you database.  this will open a browser.
    b. on the right you should see 3 tabs: Details, Plugins, Upgrade
    c. Click on Plugins tab.  You should see a list of plugins, one of which is the neosemantics plugin
    d. click install.  probably this restarts your database
4. open the neo4j browser again and you should see a prompt where you can run db commands
5. Initialize the neosemantic plugin by running the folloing command:

    <tt>call n10s.graphconfig.init();</tt>
6. Loaded a turtle example file from the 'rdf-examples' directory as follows:

    <tt>CALL n10s.rdf.import.fetch("file:{path to project}/rdf-examples/simple.ttl","Turtle");</tt>
7. Display the graph by running the following:
    <tt>match (n) return n;
    




This project was initally created with the basic set up for a typescript node project using 
the instructions from (https://khalilstemmler.com/blogs/typescript/node-starter-project/)

