match p=(root:person {user_id: %s})-[:father_child|mother_child *0..5]->
      (child:person)<-[:father_child|mother_child]-(:person)
return extract(n in nodes(p) | n.user_id) as `path`,
       extract(r in relationships(p) | type(r)) as `relation`,
       last(nodes(p)).user_id as `last`,
       length(p) as `length`
order by `length`
