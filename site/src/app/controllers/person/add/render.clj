(ns app.controllers.person.add.render
  (:require [app.util.person :as person-util]
            [clojure.data.json :as json]
            [app.views.layout :as layout]
            [korma.db :refer [rollback]]
            [app.views.layout :refer [render-message]]))

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
