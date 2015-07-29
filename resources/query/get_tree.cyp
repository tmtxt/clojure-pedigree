match p=(root:person {user_id: %s})-[:father_child|mother_child *1..%s]->(child:person)
with nodes(p) as all_nodes, relationships(p) as all_relationships, p as p
return extract(n in all_nodes | n.user_id) as `path`,
       extract(r in all_relationships | type(r)) as `relation`,
       length(p) as `depth`
order by `depth`;
