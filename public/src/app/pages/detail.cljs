(ns app.pages.detail
  (:require [cljs-react-material-ui.reagent :as ui]
            [reagent.core :as r]
            [app.store.detail :as d]
            [app.containers.languages-card :refer [v-languages-card]]
            [app.containers.keywords-card :refer [v-keywords-card]]))


;; state
(defonce s-filter (r/atom ""))

;; mutations
;; TODO add debounce
(defn m-handle-filter-change [evnet val]
  (reset! s-filter val))


;; view
(defn v-detail-component [project-name]
  [:div.detail
   [ui/card {:style {:margin-bottom 12}}
    [ui/card-title {:title @d/s-name
                    :subtitle @d/s-desc}]]
   [v-languages-card]
   [ui/card {:style {:margin-top 12}}
    [ui/card-title {:title "Keywords"}]
    [ui/text-field {:class-name "filter"
                    :hintText ""
                    :floatingLabelText "Filter"
                    :on-change m-handle-filter-change}]
    [v-keywords-card @s-filter]]])

(def v-detail
  (with-meta v-detail-component
    {:component-did-mount
     (fn [this]
       (let [id (->> this
                     r/argv
                     second)]
         (do
           (d/m-get-project id)
           (d/m-get-keywords id))))}))

