import numpy as np
import math
import cv2

# Tăng cường độ tương phản
def changeContrast(img):
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    l_channel, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    cl = clahe.apply(l_channel)
    limg = cv2.merge((cl, a, b))
    enhanced_img = cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)
    return enhanced_img

# Hàm xoay ảnh
def rotate_image(image, angle):
    if angle == 0:  # Nếu góc xoay bằng 0 thì không cần xoay
        return image
    image_center = tuple(np.array(image.shape[1::-1]) / 2)
    rot_mat = cv2.getRotationMatrix2D(image_center, angle, 1.0)
    result = cv2.warpAffine(image, rot_mat, image.shape[1::-1], flags=cv2.INTER_LINEAR)
    return result

# Hàm tính toán góc nghiêng (skew)
def compute_skew(src_img, center_thres):
    if len(src_img.shape) == 3:
        h, w, _ = src_img.shape
    elif len(src_img.shape) == 2:
        h, w = src_img.shape
    else:
        print('Unsupported image type')
        return 0.0

    # Làm mờ và phát hiện cạnh một cách tối ưu
    img = cv2.medianBlur(src_img, 1)  # Sử dụng làm mờ với kernel nhỏ
    edges = cv2.Canny(img, 30, 100, apertureSize=3, L2gradient=True)
    
    # Tìm các đường thẳng trong ảnh với các tham số điều chỉnh hợp lý
    lines = cv2.HoughLinesP(edges, 1, math.pi / 180, 30, minLineLength=w / 2, maxLineGap=h / 4)
    
    if lines is None or len(lines) == 0:
        return 0.0  # Trả về 0 nếu không có đường nào

    # Chỉ chọn đường nằm gần nhất để tính toán
    min_line = 100
    min_line_pos = 0
    for i in range(len(lines)):
        for x1, y1, x2, y2 in lines[i]:
            center_point = [((x1 + x2) / 2), ((y1 + y2) / 2)]
            if center_thres == 1 and center_point[1] < 7:
                continue
            if center_point[1] < min_line:
                min_line = center_point[1]
                min_line_pos = i

    # Tính toán góc nghiêng từ các đường thẳng tìm thấy
    angle = 0.0
    cnt = 0
    for x1, y1, x2, y2 in lines[min_line_pos]:
        ang = np.arctan2(y2 - y1, x2 - x1)
        if abs(ang) <= np.deg2rad(30):  # Chỉ tính các góc không quá lớn
            angle += ang
            cnt += 1

    if cnt == 0:
        return 0.0
    return (angle / cnt) * 180 / math.pi

# Hàm deskew (xoay ảnh về góc thẳng)
def deskew(src_img, change_cons, center_thres):
    if change_cons == 1:
        # Xoay sau khi điều chỉnh độ tương phản
        return rotate_image(src_img, compute_skew(changeContrast(src_img), center_thres))
    else:
        # Xoay mà không cần điều chỉnh độ tương phản
        return rotate_image(src_img, compute_skew(src_img, center_thres))