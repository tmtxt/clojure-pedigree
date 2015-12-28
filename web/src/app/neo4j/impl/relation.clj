(ns app.neo4j.impl.relation
  (:require [app.neo4j.impl.statement :as stm]
            [app.neo4j.query :as query]
            [clojurewerkz.neocons.rest.transaction :as tx]))

(defn create-or-update-statement
  "Create the neocon statement object for create or update relation.
  Will produce the query like this

  MATCH (a:person {user_id: {start}.user_id}), (b:person {user_id: {end}.user_id})
  CREATE UNIQUE a-[r:father_child]->b
  SET r.order = {props}.order
  RETURN r"
  [start-label start-identifier
   end-label end-identifier
   label props]
  (let [_start-label (stm/get-label start-label)
        _end-label (stm/get-label end-label)
        _label (stm/get-label label)
        _update_string (stm/map-props-to-update-string props "r" "props")
        statement (format
                   "MATCH (a:%s {%s}), (b:%s {%s}) CREATE UNIQUE a-[r:%s]->b %s RETURN r"
                   _start-label
                   (stm/map-props-to-string start-identifier "start")
                   _end-label
                   (stm/map-props-to-string end-identifier "end")
                   _label
                   (if (empty? props)
                     ""
                     (str "SET " _update_string)))]
    (tx/statement statement {:start start-identifier
                             :end end-identifier
                             :props props})))
