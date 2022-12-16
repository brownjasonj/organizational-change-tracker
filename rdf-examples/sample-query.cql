match (p:`foaf:__Person`),
    (m:`org:__Membership`),
    (org:`org:__FormalOrganization`),
    (interval:`time:__Interval`),
    (beginning:`time:__hasBeginning`),
    (m)-[]->(p),
    (m)-[]->(org),
    (m)-[]->(interval),
    (interval)-[]->(beginning)
where (org.`org:__name`) = "VIP"
where (beginning.`time:__inXSDDateTime`)<"2009-11-02T09:00:00Z"^^xsd:dateTime
return p,m,org,beginning;

match (p:`foaf:__Person`),
    (m:`org:__Membership`),
    (org:`org:__FormalOrganization`),
    (interval:`time:__Interval`),
    (beginning:`time:__hasBeginning`),
    (m)-[]->(p),
    (m)-[]->(org),
    (m)-[]->(interval),
    (interval)-[]->(beginning)
where (org.`org:__name`) = "VIP" and
    (beginning.`time:__inXSDDateTime`)< datetime("2009-11-02T09:00:00Z")
return p,m,org,beginning;