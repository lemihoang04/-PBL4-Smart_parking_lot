from PIL import Image
import cv2
import torch
import math 
import function.utils_rotate as utils_rotate
from IPython.display import display
import os
import time
import argparse
from ultralytics import YOLO
import function.helper as helper

# Hàm tải mô hình YOLO
def load_models():
    yolo_LP_detect = YOLO("E:/Python_Project/Python_project3/runs/detect/train2/weights/best.onnx")
    yolo_license_plate = torch.hub.load('yolov5', 'custom', path='model/LP_ocr_nano_62.pt', force_reload=True, source='local')
    yolo_license_plate.conf = 0.60
    return yolo_LP_detect, yolo_license_plate

# Hàm xử lý khung hình và nhận diện biển số
def process_frame(frame, yolo_LP_detect, yolo_license_plate):
    plates = yolo_LP_detect(frame)
    list_plates = plates[0].boxes.data.tolist()
    list_read_plates = set()
    
    for plate in list_plates:
        x = int(plate[0])  # xmin
        y = int(plate[1])  # ymin
        w = int(plate[2] - plate[0])  # xmax - xmin
        h = int(plate[3] - plate[1])  # ymax - ymin
        crop_img = frame[y:y + h, x:x + w]

        # Vẽ hình chữ nhật bao quanh biển số xe
        cv2.rectangle(frame, (int(plate[0]), int(plate[1])), (int(plate[2]), int(plate[3])), color=(255, 255, 225), thickness=2)
        cv2.imwrite("crop.jpg", crop_img)
        rc_image = cv2.imread("crop.jpg")
        
        lp = detect_license_plate(crop_img, yolo_license_plate)
        if lp != "unknown":
            list_read_plates.add(lp)
            draw_text(frame, plate, lp)
    
    return frame, list_read_plates

# Hàm đọc biển số xe
def detect_license_plate(crop_img, yolo_license_plate):
    lp = ""
    for cc in range(0, 2):
        for ct in range(0, 2):
            lp = helper.read_plate(yolo_license_plate, utils_rotate.deskew(crop_img, cc, ct))
            if lp != "unknown":
                return lp
    return lp

# Hàm vẽ khung và chữ
def draw_text(frame, plate, lp):
    # Vẽ nền trắng cho chữ
    text_size = cv2.getTextSize(lp, cv2.FONT_HERSHEY_SIMPLEX, 0.9, 2)[0]
    text_x = int(plate[0])
    text_y = int(plate[1]) - 5
    cv2.rectangle(frame, (text_x, text_y - text_size[1]), (text_x + text_size[0], text_y + 5), (255, 255, 255), -1)

    # Vẽ chữ màu đen
    cv2.putText(frame, lp, (text_x, text_y), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 0), 2)

# Hàm chính để chạy video
def main():
    yolo_LP_detect, yolo_license_plate = load_models()
    
    vid = cv2.VideoCapture(0)  # Có thể thay bằng đường dẫn tới video file
    prev_frame_time = 0
    new_frame_time = 0
    
    while True:
        ret, frame = vid.read()
        if not ret:
            break
        
        frame, list_read_plates = process_frame(frame, yolo_LP_detect, yolo_license_plate)
        
        # Tính FPS nếu cần
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

if __name__ == "__main__":
    main()
