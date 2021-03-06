(defproject skeleton "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"

  :dependencies [[org.clojure/clojure "1.7.0"]
                 [org.clojure/tools.nrepl "0.2.12"]
                 [compojure "1.3.4"]
                 [ring-server "0.4.0"]
                 [ring/ring-json "0.4.0"]
                 [clj-http "2.0.0"]
                 [selmer "0.8.2"]
                 [io.aviso/pretty "0.1.26"]
                 [cheshire "5.6.1"]
                 [com.taoensso/timbre "4.3.1"]
                 [danlentz/clj-uuid "0.1.6"]
                 [environ "1.0.3"]
                 [org.clojure/data.json "0.2.6"]
                 [camel-snake-kebab "0.3.2"]
                 [slingshot "0.12.2"]
                 [wharf "0.2.0-SNAPSHOT"]
                 [org.clojure/algo.monads "0.1.5"]
                 [cider/cider-nrepl "0.10.0"]
                 [com.rpl/specter "0.6.2"]
                 [buddy "0.6.0"]]

  :plugins [[lein-ring "0.8.12"]
            [lein-environ "1.0.3"]
            [lein-ancient "0.6.7"]]

  :ring {:handler app.handler/app
         :init app.handler/init
         :destroy app.handler/destroy}

  :main core.runner

  :profiles
  {:production
   {:ring {:open-browser? false, :stacktraces? false, :auto-reload? false}
    :env {:profile "production"}}

   :dev
   {:dependencies [[ring-mock "0.1.5"]
                   [ring/ring-devel "1.4.0"]]
    :ring {:open-browser? false}
    :env {:profile "dev"}
    :repl-options {:nrepl-middleware
                   [cider.nrepl.middleware.apropos/wrap-apropos
                    cider.nrepl.middleware.classpath/wrap-classpath
                    cider.nrepl.middleware.complete/wrap-complete
                    cider.nrepl.middleware.debug/wrap-debug
                    cider.nrepl.middleware.format/wrap-format
                    cider.nrepl.middleware.info/wrap-info
                    cider.nrepl.middleware.inspect/wrap-inspect
                    cider.nrepl.middleware.macroexpand/wrap-macroexpand
                    cider.nrepl.middleware.ns/wrap-ns
                    cider.nrepl.middleware.pprint/wrap-pprint
                    cider.nrepl.middleware.refresh/wrap-refresh
                    cider.nrepl.middleware.resource/wrap-resource
                    cider.nrepl.middleware.stacktrace/wrap-stacktrace
                    cider.nrepl.middleware.test/wrap-test
                    cider.nrepl.middleware.trace/wrap-trace
                    cider.nrepl.middleware.undef/wrap-undef]}}})
