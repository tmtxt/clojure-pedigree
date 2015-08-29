(ns app.test.util.person
  (:use clojure.test)
  (:require [app.util.person :as person]))

(defn get-title-as-parent-data []
  [{:person {:gender "male"}
    :expected [:father-fullname :mother-fullname]}
   {:person {:gender "female"}
    :expected [:mother-fullname :father-fullname]}
   {:person {:gender "gay"}
    :expected [:mother-fullname :father-fullname]}
   {:person {:gender "les"}
    :expected [:father-fullname :mother-fullname]}
   {:person {:gender "other"}
    :expected [:father-fullname :mother-fullname]}])

(deftest title-as-parent
  (doseq [data (get-title-as-parent-data)]
    (let [{person :person expected :expected} data
          result (person/title-as-parent person)]
      (is (= expected result))
      )))
