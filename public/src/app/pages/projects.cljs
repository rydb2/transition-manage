(ns app.pages.projects
  (:require [cljsjs.material-ui]
            [cljs-react-material-ui.core :refer [get-mui-theme color]]
            [cljs-react-material-ui.reagent :as ui]
            [reagent.core :as r]
            [app.requests :refer [get-projects]]
            [app.components.project-item :refer [v-project-item]]
            [app.store.projects :as p]
            [app.components.project-modal :refer [v-project-modal]]))

;; state
(defonce s-project-modal-visible (r/atom false))


;; mutations
(defn m-toggle-project-modal-visible []
  (swap! s-project-modal-visible not))

(defn m-handle-create [name desc lan]
  (p/m-new-project name desc lan m-toggle-project-modal-visible))


;; view
(defn v-projects-component []
  [:div.projects
    [:h1.title "Projects"]
    [ui/raised-button {:label "New Project"
                       :primary true
                       :on-click m-toggle-project-modal-visible}]
    [v-project-modal {:visible @s-project-modal-visible
                      :create true
                      :on-cancel m-toggle-project-modal-visible
                      :on-confirm m-handle-create}]
    [:ul.collection]
    [ui/table
      [ui/table-header {:display-select-all false :adjust-for-checkbox false}
        [ui/table-row
         [ui/table-header-column {:class-name "name"} "Name"]
         [ui/table-header-column {:class-name "desc"} "Description"]
         [ui/table-header-column {:class-name "version"} "Version"]
         [ui/table-header-column {:class-name "utim"} "Last Update Time"]
         [ui/table-header-column {:class-name "actions"} "Actions"]]]
      [ui/table-body
        (for [each @p/s-projects]
          ^{:key (:name each)} [v-project-item each])]]])

(def v-projects
  (with-meta v-projects-component
    {:component-did-mount p/m-fetch-projects}))
