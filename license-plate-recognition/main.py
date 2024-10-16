import cv2
import time
from src.lp_recognition import E2E


cap = cv2.VideoCapture(0)
cap.set(3,640) #set frame width
cap.set(4,480) #set frame height
cap.set(cv2.CAP_PROP_FPS, 60)


if not cap.isOpened():
    print("Không thể mở camera")
    exit()

# load model
model = E2E()

while True:
    ret, frame = cap.read()
    if not ret:
        print("Không thể nhận khung hình")
        break
    result_image = model.predict(frame)
    cv2.imshow('License Plate', result_image)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
