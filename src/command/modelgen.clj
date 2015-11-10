(ns command.modelgen
  (:require [clojure.tools.cli :refer [parse-opts]]
            [selmer.parser :as parser]
            [clojure.string :as cljstr]))

(def cli-options
  [["-n" "--name NAME" "Model Name"]
   ["-t" "--table TABLE" "Table Name"]
   ["-p" "--primary-key PK" "Primary key column"]])

(defn exit [status msg]
  (println msg)
  (System/exit status))

(defn validate [options errors]
  (cond
   errors (exit 1 (cljstr/join "\n" errors)),
   (not (:name options)) (exit 1 "Please input model name"),
   :else true))

(defn generate-model [options]
  (let [content (parser/render-file "templates/clj/models/sample_model.clj" options)]
    (spit (str "src/app/models/" (:name options) ".clj") content)
    (exit 0 (str "Model " (:name options) " generated successfully"))))

(defn -main
  [& args]
  (let [opts (parse-opts args cli-options)
        options (:options opts)
        errors (:errors opts)]
    (validate options errors)
    (generate-model options)))
