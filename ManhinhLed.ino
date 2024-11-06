#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <ESP8266WiFi.h>
#include <WebSocketsServer.h>
#include <Servo.h>

const char* ssid = "Quang Minh";
const char* password = "khongcanbiet";

LiquidCrystal_I2C lcd(0x27, 16, 2);
WebSocketsServer webSocket = WebSocketsServer(81);

String message = "";
Servo myServo;
int servoPin = 2;
unsigned long servoStartTime = 0;
bool servoMoving = false;

int trigPins[] = {D6, D3, D7};  
int echoPins[] = {D5, D8, D0};   
float distances[3];
bool slotsActive[3] = {false, false, false}; 
unsigned long previousMillis = 0;  // Thời gian trước đó
const long interval = 100;  // Khoảng thời gian giữa các lần đo

void setup() {
  Serial.begin(115200);
  
  for (int i = 0; i < 3; i++) {
    pinMode(trigPins[i], OUTPUT);
    pinMode(echoPins[i], INPUT);
  }

  // Khởi động LCD
  lcd.init();
  lcd.backlight();

  // Khởi động servo
  myServo.attach(servoPin);
  myServo.write(0);

  // Kết nối WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Đang kết nối WiFi...");
  }
  Serial.println("Đã kết nối WiFi!");
  Serial.println(WiFi.localIP());

  // Khởi động WebSocket server
  webSocket.begin();
  webSocket.onEvent(webSocketEvent);

  Serial.println("WebSocket server đã khởi động!");
}

void loop() {
  webSocket.loop();

  // Đo khoảng cách cho từng cảm biến
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;  // Cập nhật thời gian
    
    for (int i = 0; i < 3; i++) {
      measureDistance(i);  // Đo khoảng cách
    }
  }

  // Quản lý servo
  if (servoMoving && (millis() - servoStartTime >= 3000)) {
    myServo.write(0);
    delay(500);
    servoMoving = false;
    message = "";
  }

  // Kiểm tra thông điệp
  if (message.length() > 0 && !servoMoving) {
    if (isLicensePlate(message)) {
      lcd.clear();
      lcd.setCursor(2, 0);
      lcd.print("WelCome!");
      lcd.setCursor((16 - message.length()) / 2, 1);
      lcd.print(message);
      myServo.write(180);
      delay(500);
      servoStartTime = millis();
      servoMoving = true;
    } else {
      if (message.startsWith("Good Bye-")) {
        String licensePlate = message.substring(9);
        lcd.clear();
        lcd.setCursor(2, 0);
        lcd.print("Good Bye");
        lcd.setCursor((16 - licensePlate.length()) / 2, 1);
        lcd.print(licensePlate);
        myServo.write(180);
        delay(500);
        servoStartTime = millis();
        servoMoving = true;
      } else {
        lcd.clear();
        lcd.setCursor(0, 0);
        lcd.print(message);
      }
    }
  }
}

void measureDistance(int sensorIndex) {
  digitalWrite(trigPins[sensorIndex], LOW);
  delayMicroseconds(2);
  digitalWrite(trigPins[sensorIndex], HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPins[sensorIndex], LOW);

  int duration = pulseIn(echoPins[sensorIndex], HIGH, 400000); // Thêm timeout để tránh treo
  if (duration > 0) {
    distances[sensorIndex] = duration * 0.034 / 2.0;
  } else {
    distances[sensorIndex] = -1;  // Đánh dấu không có tín hiệu
  }

  Serial.print("Distance Sensor ");
  Serial.print(sensorIndex + 1);
  Serial.print(": ");
  Serial.print(distances[sensorIndex]);
  Serial.println(" cm");

  // Kiểm tra và cập nhật trạng thái cảm biến
  if (distances[sensorIndex] > 0 && distances[sensorIndex] <= 15.0 && !slotsActive[sensorIndex]) {
    slotsActive[sensorIndex] = true;
    String activeMsg = "ACTIVE" + String(sensorIndex + 1); 
    webSocket.broadcastTXT(activeMsg);
    Serial.println("Cập nhật slot " + String(sensorIndex + 1) + ": ACTIVE");
  } else if (distances[sensorIndex] > 30.0 && slotsActive[sensorIndex]) {
    slotsActive[sensorIndex] = false;
    String inactiveMsg = "INACTIVE" + String(sensorIndex + 1); 
    webSocket.broadcastTXT(inactiveMsg);
    Serial.println("Cập nhật slot " + String(sensorIndex + 1) + ": INACTIVE");
  }
}


bool isLicensePlate(String msg) {
  return (msg.length() >= 5 && msg.length() <= 10);
}

void webSocketEvent(uint8_t num, WStype_t type, uint8_t *payload, size_t length) {
  if (type == WStype_TEXT) {
    message = String((char*)payload);
    Serial.println("message nhận được: " + message);
  }
}
