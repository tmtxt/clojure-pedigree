(ns app.controllers.person.add.from-child
  (:require [app.controllers.person.add.render :as render]
            [app.controllers.person.util :refer [find-person-from-request create-person-from-request]]
            [slingshot.slingshot :refer [try+ throw+]]
            [ring.util.response :refer [redirect]]
            [app.logic.pedigree-relation :as pedigree-relation]
            [app.logic.add-person :as add-person]))

(defn process-get-request [request]
  (try+
   (let [child (find-person-from-request request "childId")
         _     (when-not child (throw+ 1))
         _     (when (pedigree-relation/enough-parents? child)
                 (throw+ "Thành viên đã có đủ cha mẹ"))]
     (render/add-page request {:action "add"
                               :from "child"
                               :child child}))
   (catch string? mes (render/error-page request mes))
   (catch Object _ (render/error-page request))))

(defn- find-child
  "Find child entity from the request"
  [request]
  (if-let [child (find-person-from-request request "childId")]
    child
    (throw+ "child not found")))

(defn- create-person
  "Create person from request"
  [request]
  (if-let [person (create-person-from-request request)]
    person
    (throw+ "cannot create person")))

(defn- create-relation
  "Create relation between child and parent"
  [child person parent-role]
  (let [rels (if (= parent-role :father)
               (add-person/from-parent child person nil)
               (add-person/from-parent child nil person))
        {father-child :father-child
         mother-child :mother-child} rels]
    (when (every? nil? [father-child mother-child])
      (throw+ "cannot create relation"))))

(defn process-post-request [request]
  (try+
   (let [child       (find-child request)
         person      (create-person request)
         parent-role (-> (pedigree-relation/detect-parent-role-single person)
                         (keyword))]
     (create-relation child person parent-role)
     (redirect (str "/person/detail/" (person :id))))
   (catch Object mes (println mes))))
