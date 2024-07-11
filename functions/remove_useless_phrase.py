def remove_useless_phrase(text):
    text = text.replace('văn phòng', '')
    text = text.replace('thư giãn', '')
    text = text.replace('thời tiết', '')
    text = text.replace('nghỉ ngơi', '')
    text = text.replace('mỗi tuần', '')
    text = text.replace('lên lịch trễ', '')
    text = text.replace('học viên', '')
    text = text.replace('đọc sách', '')

    
    return text