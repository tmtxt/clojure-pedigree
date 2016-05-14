MATCH p=(root:person)-[:father_child|mother_child *1..5]->(child:person)
WHERE id(root) = {id}
WITH nodes(p) AS all_nodes,
     relationships(p) AS all_relationships,
     length(p) AS depth,
     extract(n IN (child)-[:husband_wife|wife_husband]->(:person) | last(nodes(n)).person_id) AS marriage
RETURN extract(n IN all_nodes | n.person_id) AS `path`,
       depth AS `depth`,
       marriage AS `marriage`,
       last(extract(r IN all_relationships | r.`order`)) AS `last_order`,
       extract(n IN all_nodes | n.person_id)[-2] AS `last_parent`
ORDER BY `depth`, `last_parent`, `last_order`;
