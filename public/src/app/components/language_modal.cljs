(ns app.components.language-modal
  (:require [reagent.core :as r]
            [cljs-react-material-ui.reagent :as ui]))


;; mutations
(defn m-handle-change [s-language s-error-text new-val exist-languags]
  (cond
    (boolean (some #{new-val} exist-languags))
    (reset! s-error-text "language already exist")

    (> (count new-val) 20)
    (reset! s-error-text "too long")

    :else (do
            (reset! s-language new-val)
            (reset! s-error-text ""))))

;; view
(defn v-language-modal []
  ;; state
  (let [s-language (r/atom "")
        s-error-text (r/atom "")]
    (fn [{:keys [visible on-confirm exist-languages on-cancel on-confirm]}]
      [ui/dialog
        {:title "New Language"
         :modal true
         :open visible
         :actions (r/as-element
                    [:div
                      [ui/flat-button {:label "cancel"
                                       :primary true
                                       :style {:margin-right 8}
                                       :on-click on-cancel}]
                      [ui/flat-button {:label "confirm"
                                       :primary true
                                       :disabled (or (> (count @s-error-text) 0)
                                                     (= (count @s-language) 0))
                                       :on-click #(on-confirm @s-language)}]])}
        [ui/text-field {:on-change (fn [event new-val]
                                     (m-handle-change s-language
                                                      s-error-text
                                                      new-val
                                                      exist-languages))
                        :hint-text "enter new language name"
                        :error-text @s-error-text
                        :floating-label-text "Language"
                        :full-width true
                        :type "text"}]])))
