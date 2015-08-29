(ns app.i18n.en)

(def dict
  {:en {:user "User"
        :error {:not-login "Not Login"}

        :layout {:homepage "Homepage"
                 :treepage "Pedigree Tree"
                 :members "Members"
                 :pedigree-tree "Pedigree tree"
                 :pedigree-history "Pedigree History"
                 :contact "Contact"
                 :hello "Hello"
                 :login "Login"
                 :title "Tran Van Pedigree"
                 :head-line "Keep the value for the children"}

        ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        ;; pages
        :page-index {:preface "Preface"
                     :members "Members"
                     :news "News"
                     :more-news "More news..."
                     :images "Images"
                     :pedigree-tree "Pedigree tree"
                     :detail-tree "View detail pedigree tree"
                     :other-links "Other links"}

        :page-add-child {:father-fullname "Father full name"
                         :mother-fullname "Mother full name"
                         :child-fullname "Child full name"
                         :person-unknown "Unknown"
                         :child-order-title "Child order"
                         :submit "Add child"

                         :warning "Warning"
                         :warning-name-empty "Child name is empty"
                         :warning-name-confirm "Add a new child with unknown name?"
                         :warning-back "Cancel"
                         :warning-continue "Continue"

                         :error-parent-not-found "Parent not found"
                         :error-add-child "An error occured"

                         :success-add-child "Add child successfully"}

        :page-add-parent {:error-child-not-found "Child not found"
                          :error-enough-parent "This person has enough parent"}

        :login {:invalid-error "Username or Password incorrect"}
        }})
