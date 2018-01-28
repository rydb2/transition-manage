(ns app.routes
  (:import goog.History)
  (:require [secretary.core :as secretary :refer-macros [defroute]]
            [goog.events :as events]
            [goog.history.EventType :as EventType]
            [reagent.core :as reagent]
            [app.store.app :refer [s-routes]]
            [app.pages.projects :refer [v-projects]]
            [app.pages.detail :refer [v-detail]]))


(defn hook-browser-navigation! []
  (doto (History.)
    (events/listen
     EventType/NAVIGATE
     (fn [event]
       (secretary/dispatch! (.-token event))))
    (.setEnabled true)))


(defn app-routes []
  (secretary/set-config! :prefix "#")
  (defroute "/" []
    (swap! s-routes assoc :page :projects))
  (defroute "/projects" []
    (swap! s-routes assoc :page :projects))
  (defroute "/projects/:project-name" {:as params}
    (swap! s-routes assoc :page :detail :params params))
  (hook-browser-navigation!))


;; multi current-page fn
(defmulti current-page #(@s-routes :page))
;; projects
(defmethod current-page :projects []
  [v-projects])
;; project detail
(defmethod current-page :detail []
  [v-detail (:project-name (:params @s-routes))])
;; default
(defmethod current-page :default []
  [:h1 {:style {:text-align "center"}} "Page not found"])

