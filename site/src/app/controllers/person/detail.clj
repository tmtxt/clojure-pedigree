(ns app.controllers.person.detail
  (:require [app.views.layout :as layout]
            [app.models.person :as person]
            [app.util.main :as util]
            [app.models.pedigree-relation :refer [find-parents]]
            [app.models.marriage-relation :refer [find-partners]]))

(defn- find-entity-from-request [request]
  (-> request util/params :personId util/parse-int person/find-by-id :entity))

(defn process-get-request
  "Function for processing get request on view person detail page"
  [request]
  (if-let [person (find-entity-from-request request)]
    (let [{father :father mother :mother} (find-parents person)
          partners (find-partners person)]
      (layout/render request "person/detail.html"
                     {:person person
                      :father father
                      :mother mother
                      :partners partners}))
    (layout/render-message request "Không tìm thấy thành viên")))
