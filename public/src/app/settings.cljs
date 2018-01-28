(ns app.settings)

(goog-define dev? false)

(def protocol (if dev? "http" "https"))
;;set host
(def host (if dev? "localhost:3200" "127.0.0.1"))

(def req-prefix (str protocol "://" host))


