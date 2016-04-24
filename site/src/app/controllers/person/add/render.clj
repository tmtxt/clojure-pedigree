(ns app.controllers.person.add.render
  (:require [app.util.person :as person-util]
            [clojure.data.json :as json]
            [app.views.layout :as layout]
            [korma.db :refer [rollback]]
            [app.views.layout :refer [render-message]]
            [app.definition.person :as definition]
            [app.views.main :as view]))

(def default-opts
  {:parent {}
   :partner {}
   :child {}
   :from nil
   :action "add"})

(defn render-add-page [request & [opts]]
  (let [opts (if opts opts default-opts)
        {parent :parent
         partner :partner
         child :child
         from :from
         action :action} opts
        statuses (-> request person-util/status-display json/write-str)
        genders  (-> request person-util/gender-display json/write-str)
        parent   (-> parent person-util/filter-parent-keys json/write-str)
        child    (-> child person-util/filter-person-keys json/write-str)
        partner  (-> partner person-util/filter-partner-keys json/write-str)]
    (layout/render request
                   "person/edit_detail.html"
                   {:from from
                    :parent parent
                    :partner partner
                    :child child
                    :statuses statuses
                    :genders genders
                    :person {}
                    :action action})))

(defn render-error
  "Render error page after add"
  [request]
  (rollback)
  (render-message request "Có lỗi xảy ra" :type :error))

(defn add-page "Render add page" [request & [opts]]
  (let [{parent :parent
         partner :partner
         child :child
         from :from
         action :action} opts
        statuses (json/write-str definition/statuses-display)
        genders  (json/write-str definition/genders-display)
        parent   (json/write-str parent)
        child    (json/write-str child)
        partner  (json/write-str partner)]
    (view/render-template request
                          "person/edit_detail.html"
                          {:from from
                           :parent parent
                           :partner partner
                           :child child
                           :statuses statuses
                           :genders genders
                           :person {}
                           :action action})))

(defn error-page
  "Render error page after add"
  [request & [message]]
  (if message (view/render-message request message :type :error)
      (view/render-message request "Có lỗi xảy ra" :type :error)))
