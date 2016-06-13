(ns app.controllers.person.add
  (:require [app.controllers.person.util :as controller-util]
            [app.util.main :as util]
            [app.views.main :as view]
            [app.controllers.person.add.from-none :as from-none]
            [app.controllers.person.add.from-parent :as from-parent]
            [app.controllers.person.add.from-partner :as from-partner]
            [app.controllers.person.add.from-child :as from-child]))

(def add-person-from-none from-none/process-get-request)

(def add-person-from-parent from-parent/process-get-request)

(def add-person-from-partner from-partner/process-get-request)

(def add-person-from-child from-child/process-get-request)

(defn add-person-process [request]
  (let [params (util/params request)
        {from-person :fromPerson} params]
    (case from-person
      "parent" (from-parent/process-post-request request)
      "partner" (from-partner/process-post-request request)
      "child" (from-child/process-post-request request))))

(defn render "Render empty page for GET request" [request]
  (view/render-page "person_add_view"))

(defn process "Handle POST request" [request]
  (let [from (-> request util/params :from)]
    (case from
      "parent"  (from-parent/process-post-request request)
      "partner" (from-partner/process-post-request request)
      "child"   (from-child/process-post-request request))))
