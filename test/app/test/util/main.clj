(ns app.test.util.main
  (:use clojure.test)
  (:require [app.util.main :as util]))

(defn get-param-data []
  (let [request {:params {:hello1 "hello1 data"}
                 :query-params {"hello2" "hello2 data"}
                 :form-params {"hello3" "hello3 data"}}]
    [
     ;; path params
     {:request request
      :name "hello1"
      :default nil
      :expected "hello1 data"}
     ;; get params
     {:request request
      :name "hello2"
      :default nil
      :expected "hello2 data"}
     ;; post params
     {:request request
      :name "hello3"
      :default nil
      :expected "hello3 data"}
     ]
    ))

(deftest param
  (doseq [data (get-param-data)]
    (let [{request :request
           name :name
           default :default
           expected :expected} data
           result (util/param request name default)]
      (is (= expected result))
      )))

(defn get-parse-int-data []
  [{:input 1
    :expected 1}
   {:input 2
    :expected 2}
   {:input "hello"
    :expected nil}
   {:input "1"
    :expected 1}])

(deftest parse-int
  (doseq [data (get-parse-int-data)]
    (let [{input :input expected :expected} data
          result (util/parse-int input)]
      (is (= expected result))
      )))
