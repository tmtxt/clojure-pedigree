(ns app.models.person.prepare
  (:require [app.util.db-util :as db-util]))

(defn prepare-alive-status [alive-status]
  (db-util/str->pgobject "person_alive_status_enum" alive-status))

(defn prepare-gender [gender]
  (db-util/str->pgobject "person_gender_enum" gender))

(defn prepare-birth-date [birth-date]
  (db-util/str->pgtimestamp birth-date))

(defn prepare-death-date [death-date]
  (db-util/str->pgtimestamp death-date))
