match p=(:person {person_id: {id}})<-[:father_child|mother_child]-(:person)
return count(p) as `count`;
