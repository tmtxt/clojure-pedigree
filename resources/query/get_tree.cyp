match p=(root:person {user_id: %s})-[:father_child|mother_child *1..%s]->(child:person)
with nodes(p) as all_nodes,
     relationships(p) as all_relationships,
     length(p) as depth,
     extract(n in (child)-[:husband_wife|wife_husband]->(:person) | last(nodes(n)).user_id) as marriage
return extract(n in all_nodes | n.user_id) as `path`,
       depth as `depth`,
       marriage as `marriage`,
       last(extract(r in all_relationships | r.`order`)) as `last_order`
order by `depth`;
