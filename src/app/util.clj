(ns app.util
  (:import [org.postgresql.util PGobject]))

(defn str->pgobject
  [type value]
  (doto (PGobject.)
    (.setType type)
    (.setValue value)))
