(set-env!
 :source-paths #{"src"}
 :resource-paths #{"resources"}
 :dependencies '[[org.clojure/clojurescript "1.9.854"]
                 [org.clojure/tools.nrepl "0.2.12" :scope "test"]
                 [com.cemerick/piggieback "0.2.1" :scope "test"]
                 [weasel "0.7.0" :scope "test"]
                 [adzerk/boot-cljs "1.7.228-1" :scope "test"]
                 [adzerk/boot-cljs-repl "0.3.3" :scope "test"]
                 [adzerk/boot-reload    "0.4.13"  :scope "test"]
                 [deraen/boot-less "0.6.2" :scope "test"]
                 [rydb2/boot-webjar-sources "0.1.0" :scope "test"]
                 [pandeiro/boot-http "0.8.3"]
                 [cljsjs/react "16.1.0-0"]
                 [cljsjs/react-dom "16.1.0-0"]
                 [reagent "0.8.0-alpha2"]
                 [org.webjars/materializecss "0.100.2"]
                 [org.webjars/material-design-icons "3.0.1"]
                 [org.webjars/jquery "3.2.1"]
                 [cljs-react-material-ui "0.2.48"]
                 [cljs-http/cljs-http "0.1.44"]
                 [org.clojure/core.async "0.3.465"]
                 [secretary "1.2.3"]
                 [com.andrewmcveigh/cljs-time "0.5.2"]
                 [bouncer "1.0.1"]])


(require
 '[adzerk.boot-cljs      :refer [cljs]]
 '[adzerk.boot-cljs-repl :refer [cljs-repl start-repl cljs-repl-env]]
 '[adzerk.boot-reload    :refer [reload]]
 '[deraen.boot-less      :refer [less]]
 '[pandeiro.boot-http    :refer [serve]]
 '[clojure.java.io       :as    io]
 '[rydb2.boot-webjar-sources :refer [webjar-sources]])


(task-options!
 less {:source-map true})

(deftask prod-build []
  (comp (cljs :ids #{"main"}
              :optimizations
              :advanced)))

(deftask dev []
  (comp (speak)
        (serve :dir "target")
        (watch)
        (less)
        ;;(webjar-sources :name "materializecss"
        ;;                :matching ".*/fonts/.*.(woff|woff2|ttf)$"
        ;;                :target "fonts/roboto/")
        ;;(webjar-sources :name "materializecss"
        ;;                :matching ".*/materialize.min.js$"
        ;;                :target "lib")
        ;;(webjar-sources :name "jquery"
        ;;                :matching ".*/jquery.min.js$"
        ;;                :target "lib")
        (cljs-repl-env)
        (cljs-repl :ids #{"main"}
                   :nrepl-opts {:port 9009})
        (reload    :ids #{"main"}
                   :ws-host "localhost"
                   :on-jsload 'app.main/init
                   :target-path "target")
        (cljs      :ids #{"main"}
                   :compiler-options {:closure-defines {'app.settings/dev? true}})
        (target    :dir #{"target"})))


;; (deftask cider "CIDER profile"
;;   []
;;   (require 'boot.repl)
;;   (swap! @(resolve 'boot.repl/*default-dependencies*)
;;          concat '[[org.clojure/tools.nrepl "0.2.12"]
;;                   [cider/cider-nrepl "0.15.0"]
;;                   [refactor-nrepl "2.3.1"]))
;;   (swap! @(resolve 'boot.repl/*default-middleware*)
;;          concat '[cider.nrepl/cider-middleware
;;                   refactor-nrepl.middleware/wrap-refactor))
;;   identity)



(defn- generate-lein-project-file! [& {:keys [keep-project] :or {keep-project true}}]
  (require 'clojure.java.io)
  (let [pfile ((resolve 'clojure.java.io/file) "project.clj")
        ; Only works when pom options are set using task-options!
        {:keys [project version]} (:task-options (meta #'boot.task.built-in/pom))
        prop #(when-let [x (get-env %2)] [%1 x])
        head (list* 'defproject (or project 'boot-project) (or version "0.0.0-SNAPSHOT")
               (concat
                 (prop :url :url)
                 (prop :license :license)
                 (prop :description :description)
                 [:dependencies (conj (get-env :dependencies)
                                      ['boot/core "2.6.0" :scope "compile"])
                  :repositories (get-env :repositories)
                  :source-paths (vec (concat (get-env :source-paths)
                                             (get-env :resource-paths)))]))
        proj (pp-str head)]
      (if-not keep-project (.deleteOnExit pfile))
      (spit pfile proj)))

(deftask lein-generate
  "Generate a leiningen `project.clj` file.
   This task generates a leiningen `project.clj` file based on the boot
   environment configuration, including project name and version (generated
   if not present), dependencies, and source paths. Additional keys may be added
   to the generated `project.clj` file by specifying a `:lein` key in the boot
   environment whose value is a map of keys-value pairs to add to `project.clj`."
 []
 (with-pass-thru fs (generate-lein-project-file! :keep-project true)))
