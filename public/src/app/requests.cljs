(ns app.requests
  (:require [cljs-http.client :as http]
            [clojure.string :as string]
            [app.settings :refer [req-prefix]]
            [app.utils :refer [format-str]]))

;; graphql queries
(def query-all-projects
  "query {allProjects {_id name desc languages utime ctime version}}")

(def query-get-project
  "query {project(id: \"__id__\") {_id name desc languages utime ctime}}")

(def query-new-project
  "mutation {newProject(name: \"__name__\", desc: \"__desc__\", defaultLanguage: \"__lan__\") {_id name desc languages utime ctime}}")

(def query-update-project
  "mutation {updateProject(id: \"__id__\",name: \"__name__\", desc: \"__desc__\", languages: __languages__) {_id name desc languages utime ctime}}")

(def query-get-project-keywords
  "query {keywords(projectId: \"__id__\") {_id key content remark version utime}}")


;; functions
(defn get-projects []
  (http/post (str req-prefix "/projects") {:json-params {:query query-all-projects}}))

(defn new-project [name desc lan]
  (http/post
    (str req-prefix "/projects")
    {:json-params {:query (format-str {"__name__" name
                                       "__desc__" desc
                                       "__lan__" lan}
                                      query-new-project)}}))

(defn get-project-by-id [id]
  (http/post
    (str req-prefix "/projects")
    {:json-params {:query (format-str {"__id__" id} query-get-project)}}))

(defn update-project [id name desc languages]
  (http/post
   (str req-prefix "/projects")
   {:json-params {:query
                  (format-str {"__id__" id
                               "__name__" name
                               "__desc__" desc
                               "__languages__" (str languages)}
                              query-update-project)}}))


(defn get-project-keywords [id]
  (http/post
    (str req-prefix "/keywords")
    {:json-params {:query (format-str {"__id__" id} query-get-project-keywords)}}))

