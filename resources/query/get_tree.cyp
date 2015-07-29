match p=(root:person {user_id: 682})-[:father_child|mother_child *1..5]->(child:person)
with nodes(p) as all_nodes, relationships(p) as all_relationships, p as p
return extract(n in all_nodes | n.user_id) as `path`,
       extract(r in all_relationships | type(r)) as `relation`,
       length(p) as `depth`
order by `depth`;

match p=(root:person {user_id: 682})-[:father_child|mother_child *1..5]->
      (child:person),
      (child)-[:husband_wife|wife_husband]->(mr:person)
return extract(n in nodes(p) | n.user_id) as `path`,
       extract(r in relationships(p) | type(r)) as `relation`,
       collect(mr) as `mr`,
       length(p) as `length`
order by `length`;

with nodes(p) as all_nodes, relationships(p) as all_relationships, p as p
return extract(n in all_nodes | n.user_id) as `path`,
       extract(r in all_relationships | type(r)) as `relation`,
       length(p) as `depth`
order by `depth`;

match p=(root:person {user_id: 682})-[:father_child|mother_child *1..5]->(child:person)
return extract(n in nodes(p) | n.user_id) as `path`,
       // extract(r in relationships(p) | type(r)) as `relation`,
       length(p) as `length`,
       extract(n in head(extract(n in (child)-[:husband_wife|wife_husband]->(:person) | nodes(n))) | n.user_id)
order by length;

match p=(root:person {user_id: 682})-[:father_child|mother_child *1..5]->(child:person)
with nodes(p) as all_nodes,
     relationships(p) as all_relationships,
     length(p) as depth,
     extract(n in head(extract(n in (child)-[:husband_wife|wife_husband]->(:person) | nodes(n))) | n.user_id) as marriage
return extract(n in all_nodes | n.user_id) as `path`,
       extract(r in all_relationships | type(r)) as `relation`,
       depth as `depth`,
       marriage as `marriage`
order by `depth`;
