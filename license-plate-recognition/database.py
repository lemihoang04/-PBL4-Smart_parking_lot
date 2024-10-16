import mysql.connector

def connectDB():
    con = mysql.connector.connect(
        host='localhost:3307',
        user='root',
        password='',
        database='license_plate'
    )

    return con

# Check tên biển số đọc từ hình ảnh lưu vào thư mục "images" đã tồn tại trong database chưa
def checkNp(number_plate):
    con = connectDB()
    cursor = con.cursor()
    sql = "SELECT * FROM Numberplate WHERE number_plate = %s"
    cursor.execute(sql, (number_plate,))
    result = cursor.fetchone()  # Lấy một dòng kết quả
    con.close()
    cursor.close()
    return result

# Check tình trạng số xe (đã vào hay ra bãi đỗ)
# def checkNpStatus(number_plate):
#     con = connectDB()
#     cursor = con.cursor()
#     sql = "SELECT * FROM Numberplate WHERE number_plate = %s ORDER BY date_in DESC LIMIT 1"
#     cursor.execute(sql, (number_plate,))
#     result = cursor.fetchone()
#     con.close()
#     cursor.close()
#     return result

# Tạo bản ghi cho xe vào bãi gửi xe (cho xe vào bãi)
# Trường hợp 1: Tên biển số xe đọc từ ảnh chưa tồn tại trong database
# Trường hợp 2: Tên biển số xe đọc từ ảnh đã tồn tại trong database nhưng trạng thái của bản ghi là xe ra khỏi bãi
# def insertNp(number_plate):
#     con = connectDB()
#     cursor = con.cursor()
#     sql = "INSERT INTO Numberplate(number_plate, status, date_in) VALUES(%s,%s,%s)"
#     now = datetime.datetime.now()
#     date_in = now.strftime("%Y/%m/%d %H:%M:%S")
#     cursor.execute(sql, (number_plate, '0', date_in))
#     con.commit()
#     con.close()
#     cursor.close()
#     print("VÀO BÃI GỬI XE")
#     print("Ngày giờ vào: " + datetime.datetime.strftime(datetime.datetime.now(), "%Y/%m/%d %H:%M:%S"))
#
# # Cập nhật bản ghi khi xe ra khỏi bãi
# def updateNp(Id):
#     con = connectDB()
#     cursor = con.cursor()
#     sql = "UPDATE Numberplate SET status = 0, date_out = %s WHERE Id = %s"
#     now = datetime.datetime.now()
#     date_out = now.strftime("%Y/%m/%d %H:%M:%S")
#     cursor.execute(sql, (date_out, Id))
#     con.commit()
#     con.close()
#     cursor.close()
#     print("RA KHỎI BÃI GỬI XE")
#     print("Ngày giờ ra: " + datetime.datetime.strftime(datetime.datetime.now(), "%Y/%m/%d %H:%M:%S"))