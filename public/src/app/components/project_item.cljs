(ns app.components.project-item
  (:require [reagent.core :as r]
            [cljs-react-material-ui.reagent :as ui]
            [app.utils :refer [str-to-time format-time]]))

(defn v-project-item [project]
  [ui/table-row {:class-name "project-item"}
    [ui/table-row-column {:class-name "name"} (:name project)]
    [ui/table-row-column {:class-name "desc"} (:desc project)]
    [ui/table-row-column {:class-name "version"} (:version project)]
    [ui/table-row-column
     {:class-name "utime"}
     (->> (:utime project)
          (str-to-time)
          (format-time "yyyy/MM/dd hh:mm"))]
   [ui/table-row-column
    {:class-name "actions"}
    [:a {:href (str "#/projects/" (:_id project))}
     [ui/raised-button {:label "Detail"}]]]])
