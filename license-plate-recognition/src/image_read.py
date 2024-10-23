import data_utils as utils
import cv2
import numpy as np

def load_model(classes_path, config_path, weight_path):
    """
    Tải mô hình YOLO với các đường dẫn cấu hình và trọng số.
    """
    labels = utils.get_labels(classes_path)
    model = cv2.dnn.readNet(model=weight_path, config=config_path)
    return model, labels

def detect_number_plate(image, model, labels, threshold=0.5):
    """
    Thực hiện việc nhận diện bảng số xe từ ảnh đã cho.
    """
    boxes = []
    classes_id = []
    confidences = []
    scale = 0.00392

    # Tạo blob từ hình ảnh
    blob = cv2.dnn.blobFromImage(image, scalefactor=scale, size=(416, 416), mean=(0, 0, 0), swapRB=True, crop=False)
    height, width = image.shape[:2]

    # Đưa blob vào mô hình
    model.setInput(blob)

    # Chạy dự đoán
    outputs = model.forward(utils.get_output_layers(model))

    # Duyệt qua các outputs
    for output in outputs:
        for detection in output:
            scores = detection[5:]
            class_id = np.argmax(scores)
            confidence = float(scores[class_id])

            if confidence > threshold:
                # Tọa độ của bounding box
                center_x = int(detection[0] * width)
                center_y = int(detection[1] * height)
                detected_width = int(detection[2] * width)
                detected_height = int(detection[3] * height)

                x_min = center_x - detected_width / 2
                y_min = center_y - detected_height / 2

                boxes.append([x_min, y_min, detected_width, detected_height])
                classes_id.append(class_id)
                confidences.append(confidence)

    # Non-maximum suppression để loại bỏ các bounding box trùng lặp
    indices = cv2.dnn.NMSBoxes(boxes, confidences, score_threshold=threshold, nms_threshold=0.4)

    # Tọa độ cuối cùng của các bounding box
    coordinates = []
    if len(indices) > 0:
        for i in indices.flatten():
            x_min, y_min, width, height = boxes[i]
            x_min = round(x_min)
            y_min = round(y_min)
            x_max = round(x_min + width)
            y_max = round(y_min + height)
            coordinates.append((x_min, y_min, x_max, y_max))

    return coordinates

# Ví dụ sử dụng
if __name__ == "__main__":
    
    classes_path = "E:/Python Learning/Smart-Parking-Lot/license-plate-recognition/src/lp_detection/cfg/yolo.names"
    config_path = "E:/Python Learning/Smart-Parking-Lot/license-plate-recognition/src/lp_detection/cfg/yolov3-tiny.cfg"
    weight_path = "E:/Python Learning/Smart-Parking-Lot/license-plate-recognition/src/weights/yolov3-tiny_15000.weights"

    # Tải mô hình
    model, labels = load_model(classes_path, config_path, weight_path)

    # Đọc hình ảnh đầu vào
    image = cv2.imread('E:/Python Learning/Smart-Parking-Lot/license-plate-recognition/src/119.jpg')

    # Chạy hàm detect
    plates_coordinates = detect_number_plate(image, model, labels)

    # In kết quả
    print(plates_coordinates)
