(ns app.definition.person)

(def statuses-map "The statuses mapping for person model"
  {:alive "alive"
   :dead "dead"
   :unknown "unknown"})

(def statuses-display "The statuses map to display"
  {"alive" "Còn sống"
   "dead" "Đã mất"
   "unknown" "Không rõ"})

(def genders-map "The genders mapping for person model"
  {:male "male"
   :female "female"
   :gay "gay"
   :les "les"
   :unknown "unknown"})

(def genders-display "The genders map to display"
  {"male" "Name"
   "female" "Nữ"
   "gay" "Gay"
   "les" "Les"
   "unknown" "Không rõ"})
