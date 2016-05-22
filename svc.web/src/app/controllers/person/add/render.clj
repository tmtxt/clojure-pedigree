(ns app.controllers.person.add.render
  (:require [app.util.person :as person-util]
            [clojure.data.json :as json]
            [app.definition.person :as definition]
            [app.views.main :as view]))

(def default-opts
  {:parent {}
   :partner {}
   :child {}
   :from nil
   :action "add"})

(defn add-page "Render add page" [request & [opts]]
  (let [{parent  :parent
         partner :partner
         child   :child
         from    :from
         action  :action
         person  :person} opts
        statuses (json/write-str definition/statuses-display)
        genders  (json/write-str definition/genders-display)
        parent   (json/write-str parent)
        child    (json/write-str child)
        partner  (json/write-str partner)
        person   (json/write-str (if person person {}))]
    (view/render-template request
                          "person/edit_detail.html"
                          {:from from
                           :parent parent
                           :partner partner
                           :child child
                           :statuses statuses
                           :genders genders
                           :person person
                           :action action})))

(defn error-page
  "Render error page after add"
  [request & [message]]
  (if message (view/render-message request message :type :error)
      (view/render-message request "Có lỗi xảy ra" :type :error)))
