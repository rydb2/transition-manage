(ns app.containers.keywords-card
  (:require [reagent.core :as r]
            [cljs-react-material-ui.reagent :as ui]
            [app.store.detail :as d]
            [clojure.string :as s]
            [app.components.keyword-item :refer [v-keyword-item]]))


(defn v-keywords-card [f]
  [ui/table
   [ui/table-header {:display-select-all false
                     :adjust-for-checkbox false}
    [ui/table-row
     [ui/table-header-column "Key"]
     [ui/table-header-column "Content"]
     [ui/table-header-column "Remark"]
     [ui/table-header-column "Version"]
     [ui/table-header-column "Update Time"]]]
   [ui/table-body
    (for [keyword (if (> (count f) 0)
                    (filter
                     #(or (s/includes? (:key %) f)
                          (s/includes? (:content %) f)
                          (s/includes? (:remark %) f))
                     @d/s-keywords)
                    @d/s-keywords)]
      ^{:key (:key keyword)} [v-keyword-item keyword])]])

