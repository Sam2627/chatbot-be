# Standardized input question
def question_standardized(text):
    # Question about 'học phần' -> tag: 'học-phần'
    if 'giáo dục quốc phòng' in text:
        if 'học phần' not in text:
            text = 'học phần ' + text

    if 'học phần' in text:
        if 'miễn' in text:
            text = 'xin miễn ' + text
        if ('hình thức thi' in text) or ('thi ' in text):
            text = text.replace('tốt nghiệp','')
            text = text.replace('lâm sàng','')
        if ('lịch' in text) and ('đăng ký' in text):
            if ('trùng' in text) or ('đụng' in text):
                text = 'đăng ký học phần bị trùng lịch học'

    if ('môn' in text):
        if 'qua môn' in text:
            text = 'điểm tối thiểu để qua môn học phần'

    # Question about 'học phí'
    # tag: 'học-phí'
    if ('học phí' in text):
        if ('quy trình' in text) or ('cách thức' in text) or ('làm thế nào' in text) or ('làm sao' in text):
            text = 'đóng học phí quy trình và cách thức'
        elif (('học phí chính' in text) and (('khác ' in text) or ('phụ ' in text))) or ('học phí phụ' in text):
            text = 'các khoản học phí phụ khác bao gồm những gì'
        elif ('hỗ trợ' in text) or ('vay' in text):
            text = 'có chương trình hỗ trợ học phí cho sinh viên khó khăn'

    if ('học bổng' in text):
        if 'đạt' in text:
            text = 'điều kiện để đạt được học bổng của trường'
    
    # Question about 'lịch'
    if 'lịch' in text:
        if 'thầy cô' in text:
            if (('trễ' in text) or ('đúng' in text)) and ('hủy' not in text):
                text = 'thầy cô dạy trễ lịch học cho sinh viên'
            elif ('hủy' in text):
                text = 'thầy cô hủy lịch học và xếp lại lịch bù'
            else:
                text = text.replace('thầy cô','')       
        if 'thầy cô' not in text:    
            if ('lịch học' in text) and ('thi' not in text) and ('lịch nghỉ' not in text) and ('lịch bù' not in text):
                if ('xếp lịch' in text) and ('hợp lý' in text):
                    text = 'phòng dtdh xếp lịch học thiếu hợp lý'
                elif ('trùng' in text) or ('đụng' in text):
                    if ('lý thuyết' in text) and ('thực hành' in text):
                        text = 'xếp lịch học bị trùng giữa lý thuyết và thực hành'
            elif ('lịch học' in text) and ('thi' in text) and ('lịch nghỉ' not in text) and ('lịch bù' not in text):
                if ('cận' in text) or ('sát' in text):
                    if 'thực tập' in text:
                        text = 'lịch học thực tập và lịch thi thiếu hợp lý'
            elif ('lịch học' in text) and ('thi' not in text) and ('lịch nghỉ' in text) or ('lịch bù' in text):
                if ('sớm' in text) or ('trễ' in text):
                    text = 'theo dõi thông báo sớm về thông tin lịch bù '
                # else:
                #     text = 'theo dõi thông báo về của lịch học lịch nghỉ và lịch bù'

    if 'nghỉ hè' in text:
        if ('bao lâu' in text) or ('bao nhiêu' in text) or ('được nghỉ' in text):
            text = 'thời gian nghỉ hè của sinh viên là bao lâu'
    
    # Question about 'tiết dạy'
    if 'tiết dạy' in text:
        if 'cuối tuần' in text:
            if ('giảm' in text) or ('nghỉ' in text):
                text = 'yêu cầu giảm tiết dạy cuối tuần cho sinh viên'
        elif (('bắt đầu' in text) or ('kết thúc' in text)) or ('bao nhiêu' in text):
            text = 'thời gian bắt đầu và kết thúc của tiết dạy'
    
    # Question about 'lớp học'
    # tag: 'lớp-học'
    if not 'giảng đường' in text:
        if 'lớp học' in text:
            if ('đổi' in text) or ('chuyển' in text):
                text = 'đổi lớp học sau khi đăng ký học phần'
        if ('lớp' in text):
            if ('ghép' in text) or ('chung' in text) or ('thêm lớp' in text) or ('thêm phòng' in text):
                text = 'thiếu chỗ ngồi cho lớp học bị học chung hoặc ghép lại'

    # Question about 'giảng đường'
    # tag: 'lớp-học'
    if 'giảng đường' in text:
        if ('phù hợp' in text):
            text = 'bố trí giảng đường có sức chứa phù hợp'
        if ('mượn' in text):
            text = 'mượn giảng đường cho lớp học học tập'

    # Question about 'học tập'
    # tag: 'học-tập'
    if 'học tập' in text:
        if 'kết quả' in text:
            if ('lưu' in text) and (('cách' in text) or ('thế nào') or ('làm sao' in text)):
                text = 'cách thức lưu lại kết quả học tập'

    # Question about 'điểm'
    # tag: 'điểm'
    if 'điểm' in text:
        if 'tính điểm' in text:
            text = 'thang điểm ' + text
        if ('tốt nghiệp' in text):
            if ('để' in text) or ('có thể' in text):
                text = 'số điểm trung bình tối thiểu để tốt nghiệp'
        elif ('thang điểm' in text) and (('lý thuyết' in text) or ('thực hành' in text)):
            text = 'thang điểm thi của lý thuyết và thực hành'
    if 'thi ' in text:
        if (('đúng' in text) or ('sai' in text)) and (('đáp án' in text) or ('câu' in text)):
            text = 'cần biết đáp án câu hỏi sau khi thi để biết điểm'

    # Question about 'chứng nhận'
    # tag: 'chứng-nhận'
    if 'chuẩn năng lực' in text:
        if ('lưu' in text) or ('tích lũy' in text) or ('quản lý' in text):
            text = 'lưu minh chứng chứng nhận chuẩn năng lực'
    if 'chứng nhận' in text:
        if 'cấp lại' in text:
            text = 'xin ' + text
    
    # Question about 'tín chỉ'
    # tag: 'tín-chỉ'
    if ('tín chỉ ' in text):
        if 'trả nợ' in text:
            if 'không đủ điều kiện' in text:
                text = 'không được trả tín chỉ do thiếu điều kiện'

    # Question about 'lý thuyết'
    if ('trạm' in text):
        if ('câu' in text): 
            if ('đều' in text) or ('dài' in text) or ('giảm' in text) or ('nhiều' in text):
                text = 'đề xuất phân bổ đều câu hỏi ở trạm'
    
    # Question about 'thực tập'
    if 'thực tập' in text:
        if 'đăng ký' in text:
            text = 'sinh viên cần nơi đăng ký thực tập'
        if 'giờ' in text:
            if ('bắt đầu' in text) or ('kết thúc' in text) or ('lúc' in text):
                text = 'đề xuất thay đổi giờ thực tập'

    # Question about 'lâm sàng'
    # tag: 'lâm-sàng'
    if 'lâm sàng' in text:
        if ('đồ ' in text) or ('vật dụng' in text):
            if ('để ' in text) or ('giữ ' in text) or ('đựng ' in text):
                text = 'phòng để đồ cá nhân ở bệnh viện lâm sàng'

    # Question about 'hoạt động ngoại khóa'
    # tag: 'ngoại-khóa'
    if 'hoạt động ngoại khóa' in text:
        if 'sinh viên' in text:
            text = 'tham gia các hoạt động ngoại khóa cho sinh viên'
            
    # Question about 'ký túc xá'
    if 'ký túc xá' in text:
        if ('giờ' in text):
            if ('mở' in text) or ('đóng' in text):
                text = 'thời gian mở cửa và đóng cửa ký túc xá'


    # Question of 'Truyền thông thông tin'
    ######################################
    # Question about 'hệ thống'
    # tag: 'hệ-thống'
    if 'qr' in text:
        if 'điểm danh' in text:
            text = 'triển khai điểm danh bằng qr qua cổng thông tin'
    
    # Question about 'wifi'
    if 'wifi' in text:
        if ('phủ' in text) or ('thêm' in text) or ('lắp' in text):
            text = 'triển khai thêm wifi tăng cường độ phủ sóng'

    # Question about 'website'
    if 'trang chủ' in text:
        text = 'địa chỉ website ' + text
    
    # Question of 'Thư viện'
    ########################
    # Question about 'thư viện'
    # tag: 'thư-viện'
    if ('mượn sách' in text) or ('trả sách' in text):
        text = text + ' thư viện'
    if 'thư viện' in text:
        text = text.replace('sinh viên','')
        if ('mở cửa' in text) or ('đóng cửa' in text):
            text = text.replace('mở cửa','')
            text = text.replace('đóng cửa','')
            text = 'thời gian mở cửa đóng cửa ' + text
        elif ('mượn sách' in text) or ('trả sách' in text):
            text = 'thời gian mượn sách và trả sách của thư viện là bao lâu'

    
    # Question of 'Quản trị thiết bị'
    #################################
    # Question about 'thiết bị'
    # tag: 'thiết-bị'
    if ('quạt' in text) or ('điều hòa' in text):
        if ('lắp thêm' in text) or ('có thêm' in text) or ('bố trí' in text):
            text = 'lắp thêm quạt hoặc điều hòa cho lớp học và giảng đường'

    # Question about 'nhà xe'
    # tag: 'nhà-xe'
    if 'gửi xe' in text:
        if ('mở rộng' in text) or ('thêm' in text):
            text = 'đề xuất mở rộng sức chứa của nhà gửi xe'

    if 'camera' in text:
        if 'an ninh' in text and 'thêm' in text:
            text = 'đề xuất lắp thêm camera an ninh'

    # Question of 'Tổ chức cán bộ'
    # Question about 'Cán bộ'
    # tag: 'cán-bộ'
    # if ('là ai' in text) or ('ai là' in text):
    #     text = 'cán bộ trường ' + text

    if 'giảng viên' in text:
        if 'trường' in text:
            if ('số lượng' in text) or ('tổng số' in text) or ('bao nhiêu' in text):
                    text = 'trường đại học y dược cần thơ có bao nhiêu giảng viên'

    if 'hiệu trưởng' in text:
        text = text + ' trường'

    # Question of 'Công tác sinh viên'
    ##################################
    # Question about 'Công tác sinh viên'
    # tag: 'chung'
    if 'gym' in text:
        if ('có' in text) or ('cho' in text):
            text = 'phòng tập gym trong khuôn viên trường'
    elif 'liên lạc' in text:
        if 'giảng viên' in text:
            if 'email' in text:
                text = 'liên lạc giảng viên bằng tài khoản email của trường ' + text

    if 'trường' in text:
        if 'thành lập' in text:
            text = 'thởi gian thành lập trường đại học y dược cần thơ'

    if ('bao nhiêu' in text) or ('số lượng' in text) or ('tất cả các' in text):
        if ('khoa' in text):
            text = text + ' bao nhiêu khoa'
        elif ('phòng ban' in text) or ('phòng' in text):
            text = text + ' bao nhiêu phòng ban'

    if 'câu lạc bộ' in text:
        if ('tham gia' in text) or ('dành cho' in text):
            text = 'có bao nhiêu câu lạc bộ dành cho sinh viên để tham gia'

    # Replace question word
    #######################
    if 'ở đâu' in text:
        text = 'vị trí ' + text

    if 'làm gì' in text:
        text = 'công việc ' + text

    if 'phòng' in text:
        if 'chức năng' in text:
            text = text.replace('chức năng', 'công việc')
        
        if 'địa chỉ phòng' in text:
            text = text.replace('địa chỉ phòng', 'vị trí phòng')


    ###########
    return text

    