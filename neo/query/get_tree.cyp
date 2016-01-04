match p=(root:person {person_id: %d})-[:father_child|mother_child *1..%d]->(child:person)
with nodes(p) as all_nodes,
     relationships(p) as all_relationships,
     length(p) as depth,
     extract(n in (child)-[:husband_wife|wife_husband]->(:person) | last(nodes(n)).person_id) as marriage
return extract(n in all_nodes | n.person_id) as `path`,
       depth as `depth`,
       marriage as `marriage`,
       last(extract(r in all_relationships | r.`order`)) as `last_order`,
       extract(n in all_nodes | n.person_id)[-2] as `last_parent`
order by `depth`, `last_parent`, `last_order`;
