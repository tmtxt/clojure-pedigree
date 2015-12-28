MATCH (n:person {person_id: %s})-[r]-(p) DELETE n, r;
