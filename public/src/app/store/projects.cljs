(ns app.store.projects
  (:require [reagent.core :as r]
            [cljs.core.async :refer [<! go]]
            [app.requests :refer [get-projects new-project]]))


;; states
(defonce s-projects (r/atom []))


;; mutations
(defn m-fetch-projects []
  (go
    (let [res (<! (get-projects))
          _projects (js->clj (:allProjects (:data (:body res))))]
      (reset! s-projects (sort-by :name _projects)))))

(defn m-new-project [name desc lan cb]
  (go
    (let [res (<! (new-project name desc lan))
          _project (js->clj (:newProject (:data (:body res))))]
      (swap! s-projects concat [_project])
      (cb))))


