CALL n10s.nsprefixes.add(":", "http://example.org/id#");
CALL n10s.nsprefixes.add("foaf:", "http://xmlns.com/foaf/0.1#");
CALL n10s.nsprefixes.add("org:", "http://www.w3.org/ns/org#");
CALL n10s.nsprefixes.add("time:", "http://www.w3.org/2006/time#");
CALL n10s.nsprefixes.add("pid:", "http://example.org/pid#");


match (p:`foaf:__Person`),
    (m:`org:__Membership`),
    (org:`org:__FormalOrganization`),
    (interval:`time:__Interval`),
    (beginning:`time:__hasBeginning`),
    (m)-[]->(p),
    (m)-[]->(org),
    (m)-[]->(interval),
    (interval)-[]->(beginning)
    (interval)-[]->(hasend)
where (org.`org:__name`) = "VIP"
where (beginning.`time:__inXSDDateTime`)<"2009-11-02T09:00:00Z"^^xsd:dateTime and
return p,m,org,beginning;

match (p:`foaf:__Person`),
    (m:`org:__Membership`),
    (org:`org:__FormalOrganization`),
    (interval:`time:__Interval`),
    (beginning:`time:__hasBeginning`),
    (ending:`time:__hasEnd`),
    (m)-[`org:member`]->(p),
    (m)-[]->(org),
    (m)-[]->(interval),
    (interval)-[]->(beginning),
    (interval)-[]->(ending)
where (beginning.`time:__inXSDDateTime`)<= datetime("2009-11-02T09:00:00Z") and
        (ending.`time:__inXSDDateTime`)>= datetime("2009-11-02T09:00:00Z")
return p,m,org,beginning,ending;

match (m:`org:__Membership`),
    (m)-[]->(p:`foaf:__Person`),
    (m)-[]->(org:`org:__FormalOrganization`),
    (m)-[]->(interval:`time:__Interval`),
    (interval)-[]->(beginning:`time:__hasBeginning`),
    (interval)-[]->(ending:`time:__hasEnd`)
where (beginning.`time:__inXSDDateTime`)<= datetime("2009-11-02T09:00:00Z") and
        (ending.`time:__inXSDDateTime`)>= datetime("2009-11-02T09:00:00Z")
return p,m,org,beginning,ending;

match (m:`org:__Membership`),
    (m)-[:`org:__member`]->(p:`foaf:__Person`),
    (m)-[:`org:__organization`]->(org:`org:__FormalOrganization`),
    (m)-[:`org:__memberDuring`]->(interval:`time:__Interval`),
    (interval)-[]->(beginning:`time:__hasBeginning`),
    (interval)-[]->(ending:`time:__hasEnd`)
where (beginning.`time:__inXSDDateTime`)<= datetime("2009-11-02T09:00:00Z") and
        (ending.`time:__inXSDDateTime`)>= datetime("2009-11-02T09:00:00Z")
return p,m,org,beginning,ending;


// query with the full namespace
// Query to find all members of an organization at a given time
match (m:`http://www.w3.org/ns/org#Membership`),
    (m)-[:`http://www.w3.org/ns/org#member`]->(p:`http://xmlns.com/foaf/0.1#Person`),
    (m)-[:`http://www.w3.org/ns/org#organization`]->(org:`http://www.w3.org/ns/org#FormalOrganization`),
    (m)-[:`http://www.w3.org/ns/org#memberDuring`]->(interval:`http://www.w3.org/2006/time#Interval`),
    (interval)-[]->(beginning:`http://www.w3.org/2006/time#hasBeginning`),
    (interval)-[]->(ending:`http://www.w3.org/2006/time#hasEnd`)
where (beginning.`http://www.w3.org/2006/time#inXSDDateTime`)<= datetime("2009-11-02T09:00:00Z") and
        (ending.`http://www.w3.org/2006/time#inXSDDateTime`)>= datetime("2009-11-02T09:00:00Z")
return p,m,org,beginning,ending;



// query with the full namespace
// Query to find all members by title at a given time
match (m:`http://example.org/org#hasTitle`),
    (m)-[:`http://www.w3.org/ns/org#member`]->(p:`http://xmlns.com/foaf/0.1#Person`),
    (m)-[:`http://example.org/org#title`]->(org:`http://example.org/org#Title`),
    (m)-[:`http://example.org/org#titleDuring`]->(interval:`http://www.w3.org/2006/time#Interval`),
    (interval)-[]->(beginning:`http://www.w3.org/2006/time#hasBeginning`),
    (interval)-[]->(ending:`http://www.w3.org/2006/time#hasEnd`)
where (beginning.`http://www.w3.org/2006/time#inXSDDateTime`)<= datetime("2009-11-02T09:00:00Z") and
        (ending.`http://www.w3.org/2006/time#inXSDDateTime`)>= datetime("2009-11-02T09:00:00Z")
return p,m,org,beginning,ending;