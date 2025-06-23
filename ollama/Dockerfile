# Sử dụng Python base image
FROM python:3.13-slim

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy file requirements (nếu có)
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ mã nguồn
COPY . .

# Mở port cho Streamlit
EXPOSE 8501

# Mặc định chạy app
CMD ["streamlit", "run", "app.py", "--server.port", "8501", "--server.address", "0.0.0.0"]
