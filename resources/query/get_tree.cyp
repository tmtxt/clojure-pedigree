match p=(root:person {user_id: %s})-[:father_child|mother_child *1..%s]->(child:person)
with nodes(p) as all_nodes,
     // relationships(p) as all_relationships,
     length(p) as depth,
     extract(n in (child)-[:husband_wife|wife_husband]->(:person) | last(nodes(n)).user_id) as marriage
return extract(n in all_nodes | n.user_id) as `path`,
       // extract(r in all_relationships | type(r)) as `relation`,
       depth as `depth`,
       marriage as `marriage`
order by `depth`;
