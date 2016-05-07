(ns app.definition.user)

(def roles-map "The roles mapping for user"
  {:admin "admin"
   :user "user"})

(defn get-role [role]
  (get roles-map role "user"))
