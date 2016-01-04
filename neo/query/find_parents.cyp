match p=(current_person:person {person_id: {id}})<-[:father_child|mother_child]-(parent:person)
with nodes(p) as all_nodes,
     relationships(p) as all_relationships
return last(extract(n in all_nodes | n.person_id)) as `parent_id`,
       head(extract(r in all_relationships | type(r))) as `parent_type`;
