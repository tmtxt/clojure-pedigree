match p=(:person {person_id: %s})<-[:father_child|mother_child]-(:person)
return count(p);
