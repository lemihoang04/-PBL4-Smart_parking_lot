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
yolo_LP_detect = torch.hub.load('yolov5', 'custom', path='model/lp_detect.pt', force_reload=True, source='local')
yolo_license_plate = torch.hub.load('yolov5', 'custom', path='model/LP_ocr_nano_2.onnx', force_reload=True, source='local')
yolo_LP_detect.conf = 0.30
yolo_license_plate.conf = 0.70

prev_frame_time = 0
new_frame_time = 0

vid = cv2.VideoCapture(0)
vid.set(cv2.CAP_PROP_FPS, 30)
plate_count = 0
old=""
# vid = cv2.VideoCapture("1.mp4")

while(True):
    ret, frame = vid.read()
    frame = cv2.resize(frame, (640, 480))
    plates = yolo_LP_detect(frame)
    list_plates = plates.pandas().xyxy[0].values.tolist()
    list_read_plates = set()
    for plate in list_plates:
        flag = 0
        x = int(plate[0])  # xmin
        y = int(plate[1])  # ymin
        w = int(plate[2] - plate[0])  # xmax - xmin
        h = int(plate[3] - plate[1])  # ymax - ymin
        crop_img = frame[y:y + h, x:x + w]

        # Vẽ hình chữ nhật bao quanh biển số xe
        cv2.rectangle(frame, (int(plate[0]), int(plate[1])), (int(plate[2]), int(plate[3])), color=(255, 255, 225),
                      thickness=2)
        lp = ""
        
        for cc in range(0, 2):
            for ct in range(0, 2):
                lp = helper.read_plate(yolo_license_plate, utils_rotate.deskew(crop_img, cc, ct))
                if lp != "unknown":
                    
                    if old == lp:
                        plate_count += 1
                        
                    else:
                        plate_count = 1
                        old = lp

                    # Check if the plate has been detected 10 times
                    if plate_count == 5:
                        print(f"License Plate Detected: {lp}")
                    # Vẽ nền trắng cho chữ
                    text_size = cv2.getTextSize(lp, cv2.FONT_HERSHEY_SIMPLEX, 0.9, 2)[0]
                    text_x = int(plate[0])
                    text_y = int(plate[1]) - 10
                    cv2.rectangle(frame, (text_x, text_y - text_size[1] - 10), (text_x + text_size[0], text_y +10),
                                  (255, 255, 255), -1)

                    # Vẽ chữ màu đen
                    cv2.putText(frame, lp, (text_x, text_y), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 0), 2)
                    flag = 1
                    break
            if flag == 1:
                break
    new_frame_time = time.time()
    fps = 1/(new_frame_time-prev_frame_time)
    prev_frame_time = new_frame_time
    fps = int(fps)
    cv2.putText(frame, str(fps), (7, 70), cv2.FONT_HERSHEY_SIMPLEX, 3, (100, 255, 0), 3, cv2.LINE_AA)
    cv2.imshow('frame', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

vid.release()
cv2.destroyAllWindows()