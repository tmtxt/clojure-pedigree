(ns app.controllers.person.display
  (:require [app.util.datetime :as dt]))

;;; Some definitions
(def ^:private unknown-string "String to display when unknown" "Chưa có thông tin")
(def ^:private genders-map
  {"male" "Nam"
   "female" "Nữ"
   "gay" "Gay"
   "les" "Les"
   "unknown" unknown-string})
(def ^:private statuses-map
  {"alive" "Còn sống"
   "dead" "Đã mất"
   "unknown" unknown-string})

(defn- process-status
  "Process status for display"
  [status]
  (get statuses-map status (genders-map "unknown")))

(defn- process-gender
  "Process gender for display"
  [gender]
  (get genders-map gender (genders-map "unknown")))

(def funcs-map {:birth-date dt/timestamp->string
                :death-date dt/timestamp->string
                :created-at dt/timestamp->string
                :status process-status
                :gender process-gender})

(defn- same
  "Very simple function that returns anything it receives"
  [v] v)

(defn- value->string
  "Function for creating another function for transform value"
  [k keep-nil]
  (let [func (get funcs-map k same)]
    (fn [v]
      (cond
        (not (nil? v)) (func v)
        keep-nil nil
        :else unknown-string
        ))))

(defn json-friendlify
  "Json Friendlify person entity for client side displaying.
  Optional :keys is the list of keys to transform. If not specify, all values are transformed.
  If :keep-nil is true, preserve nil value"
  [entity & {:keys [keys keep-nil]
             :or {keys nil
                  keep-nil false}}]
  (let [sub-entity (if keys (select-keys entity keys) entity)
        new-entity (into {}
                         (for [[k v] sub-entity]
                           (let [func (value->string k keep-nil)]
                             [k (func v)])))]
    (merge entity new-entity)))

(defn json-friendlify-all
  "Json Friendlify all person entities"
  [entities & {:keys [keys]
               :or {keys nil}}]
  (map #(json-friendlify %) entities))
