MATCH p=(n:person)<-[:father_child|mother_child]-(:person)
WHERE id(n) = {id}
RETURN count(p) AS `count`;
