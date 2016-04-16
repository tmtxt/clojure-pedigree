MATCH p=(current_person:person)<-[:father_child|mother_child]-(parent:person)
WHERE id(current_person) = {id}
WITH nodes(p) AS all_nodes,
     relationships(p) AS all_relationships
RETURN last(extract(n IN all_nodes | n.person_id)) AS `parent_id`,
       head(extract(r IN all_relationships | type(r))) AS `parent_type`;
