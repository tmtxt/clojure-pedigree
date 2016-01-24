(ns app.controllers.person
  (:require [app.controllers.person.routes :as routes]
            [app.controllers.person.rules :as rules]))

(def person-routes routes/person-routes)
(def person-rules rules/person-rules)
