(ns core.test
  (:use [app.models.person]
        [korma.core])
  (:require [app.db]))

(defn -main
  [& args]
  (println (select person)))
