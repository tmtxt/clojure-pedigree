MATCH p=(current_person:person)-[:husband_wife|wife_husband]->(partner_person:person)
WHERE id(current_person) = {id}
WITH nodes(p) AS all_nodes,
     relationships(p) AS all_relationships
RETURN last(extract(n IN all_nodes | n.person_id)) AS `partner_id`,
       head(extract(r IN all_relationships | r.`order`)) AS `partner_order`
ORDER BY `partner_order`;
