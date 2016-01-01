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

        :person {:alive "Còn sống"
                 :dead "Đã mất"
                 :unknown "Không rõ"
                 :male "Nam"
                 :female "Nữ"
                 :gay "Gay"
                 :les "Les"}

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

                         :warning "Cảnh báo"
                         :warning-name-empty "Họ tên con còn trống."
                         :warning-name-confirm "Thêm con với tên họ không rõ?"
                         :warning-back "Quay lại"
                         :warning-continue "Tiếp tục"

                         :error-parent-not-found "Không tìm thấy cha mẹ"
                         :error-add-child "Có lỗi trong quá trình thực hiện."

                         :success-add-child "Thêm con thành công"}

        :login {:invalid-error "Tên đăng nhập hoặc mật khẩu không đúng"}
        }})
