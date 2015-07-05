match p=(root:person {user_id: 682})-[:father_child|mother_child *0..5]->
      (child:person)<-[:father_child|mother_child]-(:person)
with nodes(p) as all_nodes, relationships(p) as all_relationships, p as p
return extract(n in all_nodes | n.user_id) as `path`,
       extract(r in all_relationships | type(r)) as `relation`,
       last(all_nodes).user_id as `last`,
       length(p) as `length`
order by `length`;
