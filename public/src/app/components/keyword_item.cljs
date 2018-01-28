(ns app.components.keyword-item
  (:require [reagent.core :as r]
            [cljs-react-material-ui.reagent :as ui]
            [app.utils :refer [str-to-time format-time]]))


(defn v-keyword-item [keyword]
  [ui/table-row {:class-name "keyword-item"}
   [ui/table-row-column {:class-name "key"} (:key keyword)]
   [ui/table-row-column
    {:class-name "conent"
     :style {:whiteSpace "normal"}}
    (:content keyword)]
   [ui/table-row-column
    {:class-name "remark"
     :style {:whiteSpace "normal"}}
    (:remark keyword)]
   [ui/table-row-column {:class-name "version"} (:version keyword)]
   [ui/table-row-column
    {:class-name "utime"}
    (->> (:utime keyword)
         (str-to-time)
         (format-time "yyyy/MM/dd hh:mm"))]])

