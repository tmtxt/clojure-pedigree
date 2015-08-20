(ns app.i18n.vi)

(def dict
  {:vi {:user "Người dùng"
        :error {:not-login "Chưa đăng nhập"}

        :layout {:homepage "Trang chủ"
                 :treepage "Cây gia phả"
                 :members "Thành viên"
                 :pedigree-tree "Cây gia phả"
                 :pedigree-history "Lịch sử dòng họ"
                 :contact "Liên hệ"
                 :hello "Xin chào"
                 :login "Đăng nhập"
                 :title "Trần Văn Gia Phả"
                 :head-line "Gìn giữ cho muôn đời sau"}

        ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
        ;; pages
        :page-index {:preface "Lời tâm huyết"
                     :members "Thành viên"
                     :news "Tin vắn dòng họ"
                     :more-news "Xem thêm tin tức..."
                     :images "Hình ảnh"
                     :pedigree-tree "Cây gia phả"
                     :detail-tree "Xem cây gia phả chi tiết"
                     :other-links "Liên kết khác"}

        :page-add-child {:father-fullname "Họ và tên bố"
                         :mother-fullname "Họ và tên mẹ"
                         :child-fullname "Họ và tên con"
                         :person-unknown "Không rõ"
                         :child-order-title "Là con thứ bao nhiêu trong gia đình?"
                         :submit "Thêm con"

                         :error-parent-not-found "Không tìm thấy cha mẹ"}

        :login {:invalid-error "Tên đăng nhập hoặc mật khẩu không đúng"}
        }})
