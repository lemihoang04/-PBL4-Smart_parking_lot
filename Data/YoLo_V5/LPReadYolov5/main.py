import cv2
import torch
import function.utils_rotate as utils_rotate
import time
import function.helper as helper
import urllib.request
import numpy as np
import websocket
import requests

# Tải mô hình YOLO
yolo_LP_detect = torch.hub.load('yolov5', 'custom', path='model/lp_detect.onnx', force_reload=True, source='local')
yolo_license_plate = torch.hub.load('yolov5', 'custom', path='model/lp_read.onnx', force_reload=True, source='local')
yolo_LP_detect.conf = 0.50
yolo_license_plate.conf = 0.60

# Kết nối đến WebSocket của ESP8266
ws = websocket.create_connection("ws://192.168.43.206:81")  # Địa chỉ IP của ESP8266

previous_plate = ""
count = 0
required_count = 5

# URL camera IP
url = 'http://192.168.43.70/cam-hi.jpg'

prev_frame_time = 0
new_frame_time = 0

while True:
    # Lấy hình ảnh từ camera IP
    img_resp = urllib.request.urlopen(url)
    imgnp = np.array(bytearray(img_resp.read()), dtype=np.uint8)
    frame = cv2.imdecode(imgnp, -1)

    if frame is None:
        print("Không thể nhận khung hình")
        continue

    frame = cv2.resize(frame, (640, 480))
    
    # Nhận diện biển số xe
    plates = yolo_LP_detect(frame)
    list_plates = plates.pandas().xyxy[0].values.tolist()
    
    for plate in list_plates:
        flag = 0
        x = int(plate[0])
        y = int(plate[1])
        w = int(plate[2] - plate[0])
        h = int(plate[3] - plate[1])
        crop_img = frame[y:y + h, x:x + w]
        
        cv2.rectangle(frame, (x, y), (x + w, y + h), color=(255, 255, 225), thickness=2)
        
        # Đọc ký tự biển số
        lp = ""
        for cc in range(0, 2):
            for ct in range(0, 2):
                lp = helper.read_plate(yolo_license_plate, utils_rotate.deskew(crop_img, cc, ct))
                if lp != "unknown":
                    # Vẽ biển số lên khung hình
                    text_size = cv2.getTextSize(lp, cv2.FONT_HERSHEY_SIMPLEX, 0.9, 2)[0]
                    text_x = int(plate[0])
                    text_y = int(plate[1]) - 10
                    cv2.rectangle(frame, (text_x, text_y - text_size[1] - 10), (text_x + text_size[0], text_y + 10),
                                  (255, 255, 255), -1)
                    cv2.putText(frame, lp, (text_x, text_y), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 0), 2)
                    
                    if lp == previous_plate:
                        count += 1
                    else:
                        previous_plate = lp
                        count = 1

                    if count == required_count:
                        print(f"Gửi biển số xe: {lp} qua ESP8266")
                        response = requests.post("http://localhost:8081/api/createTime", json={"license_plate": lp})
                        data = response.json()
                        ws.send(data['errMessage'])  # Gửi biển số qua WebSocket
                        count = 0
                    flag = 1
                    break
            if flag == 1:
                break
    # try:
    #     msg = ws.recv()  
    #     print("Nhận thông điệp từ WebSocket:", msg)
    #     if msg == "active" or msg == "unactive":
    #         print(f"Cập nhật cơ sở dữ liệu với trạng thái: {msg}") 
    # except websocket.WebSocketConnectionClosedException:
    #     print("Kết nối WebSocket đã đóng")
    #     break

    # Hiển thị FPS
    new_frame_time = time.time()
    fps = 1 / (new_frame_time - prev_frame_time)
    prev_frame_time = new_frame_time
    fps = int(fps)
    cv2.putText(frame, str(fps), (7, 70), cv2.FONT_HERSHEY_SIMPLEX, 3, (255, 255, 255), 3, cv2.LINE_AA)

    cv2.imshow('License Plate Detection', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cv2.destroyAllWindows()
ws.close()
