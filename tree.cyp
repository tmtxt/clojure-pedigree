match p=(:person {user_id: 643})-[:father_child|mother_child *0..5]->(:person)
return extract(n in nodes(p) | n.user_id) as `path`,
       last(nodes(p)).user_id as `last`,
       length(p) as `length`
order by `length`;

match p=(:person {user_id: 643})-[:father_child|mother_child *0..5]->(:person)
return extract(n in nodes(p) | n.user_id) as `path`,
       extract(r in relationships(p) | type(r)) as `relation`,
       last(nodes(p)).user_id as `last`,
       length(p) as `length`
order by `length`;

match (n:person) return n.user_id;
