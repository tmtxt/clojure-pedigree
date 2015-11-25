(ns app.models.person.display)

(def ^:private genders-display-map
  {"male" "Nam"
   "female" "Nữ"
   "gay" "Gay"
   "les" "Les"
   "unknown" "Không rõ"})

(def ^:private statuses-display-map
  {"alive" "Còn sống"
   "dead" "Đã mất"
   "unknown" "Không rõ"})

(defn gender-to-string [gender]
  (get genders-display-map gender (genders-display-map "unknown")))

(defn status-to-string [status]
  (get statuses-display-map status (statuses-display-map "unknown")))
