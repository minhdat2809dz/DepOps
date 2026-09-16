# Sử dụng Nginx Alpine siêu nhẹ (~20MB)
FROM nginx:alpine

# Xóa các file mặc định của Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copy toàn bộ mã nguồn frontend vào thư mục phục vụ web của Nginx
COPY . /usr/share/nginx/html

# Cấu hình cổng mạng 80
EXPOSE 80

# Khởi chạy Nginx ở chế độ foreground
CMD ["nginx", "-g", "daemon off;"]
