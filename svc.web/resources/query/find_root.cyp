match (root:person {is_root: true})
return root,
       extract(n in (root)-[:husband_wife|wife_husband]->(:person) | last(nodes(n)).person_id) as marriage;
