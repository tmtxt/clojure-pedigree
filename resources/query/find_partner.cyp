match p=(current_person:person {user_id: %s})-[:husband_wife|wife_husband]->(partner_person:person)
with nodes(p) as all_nodes,
     relationships(p) as all_relationships
return last(extract(n in all_nodes | n.user_id)) as `partner_id`,
       head(extract(r in all_relationships | r.`order`)) as `partner_order`
order by `partner_order`;
