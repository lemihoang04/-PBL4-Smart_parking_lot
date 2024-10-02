import cv2
import time
from src.lp_recognition import E2E

# Sử dụng camera mặc định (camera 0)
cap = cv2.VideoCapture(0)
cap.set(3,640) #set frame width
cap.set(4,480) #set frame height
cap.set(cv2.CAP_PROP_FPS, 5)

# Kiểm tra xem camera có mở thành công hay không
if not cap.isOpened():
    print("Không thể mở camera")
    exit()

# load model
model = E2E()

while True:
    # Đọc khung hình từ camera
    ret, frame = cap.read()

    # Kiểm tra nếu khung hình đọc không thành công
    if not ret:
        print("Không thể nhận khung hình")
        break

    # Bắt đầu nhận diện biển số
    #start = time.time()
    # Dự đoán biển số
    result_image = model.predict(frame)
    #end = time.time()
    #print('Model process on %.2f s' % (end - start))

    # Hiển thị hình ảnh có biển số được nhận diện
    cv2.imshow('License Plate', result_image)

    #time.sleep(1)
    # Nhấn 'q' để thoát khỏi vòng lặp
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Giải phóng camera và đóng tất cả các cửa sổ
cap.release()
cv2.destroyAllWindows()
