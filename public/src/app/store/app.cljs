(ns app.store.app
  (:require [reagent.core :as r]))

(def s-routes (r/atom {:page ""
                       :params {}}))
