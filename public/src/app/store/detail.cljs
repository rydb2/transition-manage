(ns app.store.detail
  (:require [reagent.core :as r]
            [cljs.core.async :refer [<! go]]
            [app.requests :refer [get-project-by-id
                                  update-project
                                  get-project-keywords]]))


;; state
(defonce s-id (r/atom ""))
(defonce s-name (r/atom ""))
(defonce s-desc (r/atom ""))
(defonce s-languages (r/atom []))
(defonce s-utime (r/atom ""))
(defonce s-ctime (r/atom ""))
(defonce s-keywords (r/atom []))

(defn reset-atoms [project]
  (do
    (reset! s-id (:_id project))
    (reset! s-name (:name project))
    (reset! s-desc (:desc project))
    (reset! s-languages (:languages project))
    (reset! s-utime (:utime project))
    (reset! s-ctime (:ctime project))))


;; mutations
(defn m-get-project [id]
  (go
    (let [res (<! (get-project-by-id id))
          _project (->> res
                        (:body)
                        (:data)
                        (:project)
                        (js->clj))]
      (reset-atoms _project))))


(defn m-add-language [lan]
  (swap! s-languages #(concat % [lan])))


(defn m-remove-language [lan]
  (swap! s-languages (fn [l] (remove #(== lan %) s-languages))))


(defn m-update-project []
  (go
    (let [res (<! (update-project @s-id @s-name @s-desc @s-languages))
          _project (->> res
                        (:body)
                        (:data)
                        (:updateProject)
                        (js->clj))]
      (reset-atoms _project))))


(defn m-get-keywords [id]
  (go
    (let [res (<! (get-project-keywords id))
          _keywords (->> res
                         (:body)
                         (:data)
                         (:keywords)
                         (js->clj))]
      (js/console.log _keywords)
      (reset! s-keywords _keywords))))
