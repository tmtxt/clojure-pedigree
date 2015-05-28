(ns app.util.dbUtil
  (:import [org.postgresql.util PGobject]))

(defn str->pgobject
  "Convert string into pgobject. Used for transform"
  [type value]
  (doto (PGobject.)
    (.setType type)
    (.setValue value)))
