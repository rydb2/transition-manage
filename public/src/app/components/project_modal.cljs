(ns app.components.project-modal
  (:require [reagent.core :as r]
            [cljs-react-material-ui.reagent :as ui]
            [cljs.core.async :refer [<! go]]
            [app.requests :refer [new-project]]))

;; states
(defonce s-name (r/atom ""))
(defonce s-desc (r/atom ""))
(defonce s-lan (r/atom ""))

;; actions


;; view
(defn v-project-modal [{:keys [visible on-confirm on-cancel create]}]
  [ui/dialog
    {:title (if create "Create New Project" "Project")
      :modal true
      :actions (r/as-element
                 [:div
                   [ui/flat-button {:label "cancel" :primary true :on-click on-cancel}]
                   [ui/flat-button {:label "confirm"
                                    :primary true
                                    :on-click #(on-confirm @s-name @s-desc @s-lan)}]])
      :open visible}
    [ui/text-field {:on-change (fn [event new-val] (swap! s-name #(-> new-val)))
                    :hint-text "enter project name"
                    :floating-label-text "Project"
                    :type "text"}]
    [:br]
    [ui/text-field {:on-change (fn [event new-val] (swap! s-desc #(-> new-val)))
                    :hint-text "enter project description"
                    :floating-label-text "Description"
                    :type "text"}]
    [:br]
    [ui/text-field {:on-change (fn [event new-val] (swap! s-lan #(-> new-val)))
                    :hint-text "enter default project language"
                    :floating-label-text "Default Language"
                    :type "text"}]])
