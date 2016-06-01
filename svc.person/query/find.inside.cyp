MATCH p=(root:person)-[:father_child *1..]->(child:person)
WHERE id(root) = 8
RETURN child
