match p=(:person {user_id: 131})<-[:father_child|mother_child]-(:person)
return count(p);
