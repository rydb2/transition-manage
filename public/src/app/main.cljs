(ns app.main
  (:require [cljsjs.material-ui]
            [cljs-react-material-ui.core :refer [get-mui-theme color]]
            [cljs-react-material-ui.reagent :as ui]
            [reagent.core :as r]
            [react :as react]
            [react-dom :as react-dom]
            [app.pages.projects :refer [v-projects]]
            [app.utils :refer [format-str]]
            [app.routes :refer [current-page app-routes]]))


(defn init []
  (app-routes)
  (r/render
    [ui/mui-theme-provider
      {:mui-theme (get-mui-theme
                    {:palette {:primary1-color (color :blue800)}})}
      [current-page]]
   (js/document.getElementById "app")))

