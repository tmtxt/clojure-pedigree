match p=(root:person {user_id: %s})-[:father_child|mother_child *1..%s]->
      (child:person)<-[:father_child|mother_child]-(:person)
with nodes(p) as all_nodes, relationships(p) as all_relationships, p as p
return extract(n in all_nodes | n.user_id) as `path`,
       extract(r in all_relationships | type(r)) as `relation`,
       last(all_nodes[0..length(all_nodes)-2]).user_id as `in-parent`,
       last(all_nodes).user_id as `out-parent`,
       last(all_nodes[0..length(all_nodes)-1]).user_id as `child`,
       length(p) as `length`
order by `length`;
