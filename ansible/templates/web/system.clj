;;; GENERATED BY ANSIBLE. DO NOT EDIT
;;; EDIT TEMPLATE IN ansible/templates/system_config.clj

;;; The config here will be merged with the config in src/config/main.clj to
;;; product the final main config
(ns config.system)

(def config
  {:ring-port {{ web_ring_port }}
   :nrepl-port {{ web_nrepl_port }}
   :root-git-dir {{ web_root_git_dir | to_json }}
   })
