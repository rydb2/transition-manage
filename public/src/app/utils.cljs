(ns app.utils
  (:require [clojure.string :as string]
            [cljs-time.format :as time-format]
            [cljs-time.local :as time-local]
            [cljs.core.async :refer [chan <! >! go]]))

(defn format-str [map string]
  "fromat string
   format-str(
     {\"__a__\" bb}
     \"example __a__\")
   get \"example bb\""
  (let [regex-str (string/join "|" (keys map))]
    (string/replace string (re-pattern regex-str) map)))

(defn str-to-time [str]
  (time-local/to-local-date-time str))

(defn format-time [format time]
  (let [formatter (time-format/formatter format)]
    (time-format/unparse formatter time)))


(defn debounce
  ([c ms] (debounce (chan) c ms))
  ([c' c ms]
   (go
     (loop [start nil loc (<! c)]
       (if (nil? start)
         (do
           (>! c' loc)
           (recur (js/Date.) nil))
         (let [loc (<! c)]
           (if (>= (- (js/Date.) start) ms)
             (recur nil loc)
             (recur (js/Date.) loc))))))
   c'))


