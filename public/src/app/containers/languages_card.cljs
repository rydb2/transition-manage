(ns app.containers.languages-card
  (:require [cljsjs.material-ui]
            [cljs-react-material-ui.core :refer [get-mui-theme color]]
            [cljs-react-material-ui.reagent :as ui]
            [reagent.core :as r]
            [app.store.detail :as d]
            [app.components.language-modal :refer [v-language-modal]]))

;; state
(def s-language-modal (r/atom false))


;; mutation
(defn m-new-lan [lan]
  (d/m-add-language lan)
  (swap! s-language-modal not))

(defn m-remove-lan [lan]
  (d/m-remove-language lan))

(defn m-update-project []
  (d/m-update-project))


;; view
(defn v-languages-card []
  [ui/card
    [ui/card-header {:title "Languages"}]
    [ui/card-text {:style {:display "flex" :flex-wrap "wrap"}}
      (if (== 0 (count @d/s-languages))
        [:span.empty "no language"]
        (for [lan @d/s-languages]
          [ui/chip
            {:key lan
             :style {:margin 5}
             :on-request-delete m-remove-lan}
            lan]))]
    [ui/card-actions {:style {:text-align "right"}}
      [ui/raised-button {:label "Add"
                         :on-click #(swap! s-language-modal not)}]
      [ui/raised-button {:label "Save"
                         :on-click m-update-project}]]
    (when @s-language-modal
      [v-language-modal {:visible true
                         :exist-languages @d/s-languages
                         :on-confirm m-new-lan
                         :on-cancel #(swap! s-language-modal not)}])])



