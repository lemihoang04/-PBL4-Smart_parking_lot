from PIL import Image
import cv2
import torch
import math 
import function.utils_rotate as utils_rotate
from IPython.display import display
import os
import time
import argparse
import function.helper as helper

# load model
yolo_LP_detect = torch.hub.load('yolov5', 'custom', path='model/LP_detector_nano_61.onnx', force_reload=True, source='local')
yolo_license_plate = torch.hub.load('yolov5', 'custom', path='model/LP_ocr_nano_62.onnx', force_reload=True, source='local')
yolo_LP_detect.conf = 0.30

yolo_license_plate.conf = 0.70

# Đọc ảnh từ file
image_path = 'test_image/119.jpg'  # Thay bằng đường dẫn ảnh của bạn
frame = cv2.imread(image_path)

plates = yolo_LP_detect(frame)
list_plates = plates.pandas().xyxy[0].values.tolist()
print(list_plates)
list_read_plates = set()
for plate in list_plates:
    flag = 0
    x = int(plate[0])  # xmin
    y = int(plate[1])  # ymin
    w = int(plate[2] - plate[0])  # xmax - xmin
    h = int(plate[3] - plate[1])  # ymax - ymin
    crop_img = frame[y:y + h, x:x + w]

    # Vẽ hình chữ nhật bao quanh biển số xe
    cv2.rectangle(frame, (int(plate[0]), int(plate[1])), (int(plate[2]), int(plate[3])), color=(0, 0, 0), thickness=2)
    cv2.imwrite("crop.jpg", crop_img)
    rc_image = cv2.imread("crop.jpg")
    lp = ""

    for cc in range(0, 2):
        for ct in range(0, 2):
            lp = helper.read_plate(yolo_license_plate, utils_rotate.deskew(crop_img, cc, ct))
            if lp != "unknown":
                list_read_plates.add(lp)

                # Vẽ nền trắng cho chữ
                text_size = cv2.getTextSize(lp, cv2.FONT_HERSHEY_SIMPLEX, 0.9, 2)[0]
                text_x = int(plate[0])
                text_y = int(plate[1]) - 10
                cv2.rectangle(frame, (text_x, text_y - text_size[1] - 10), (text_x + text_size[0], text_y +10),
                              (0, 0, 0), -1)

                # Vẽ chữ màu đen
                cv2.putText(frame, lp, (text_x, text_y), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 255), 2)
                flag = 1
                break
        if flag == 1:
            break

# Hiển thị ảnh đã xử lý
cv2.imshow('Processed Image', frame)
cv2.waitKey(0)  # Chờ nhấn phím bất kỳ để đóng cửa sổ
cv2.destroyAllWindows()
