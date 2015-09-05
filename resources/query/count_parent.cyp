match p=(:person {user_id: %s})<-[:father_child|mother_child]-(:person)
return count(p);
