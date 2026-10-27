import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('May Tinh Bang', 'Máy Tính Bảng')
content = content.replace('May Anh Camera', 'Máy Ảnh &amp; Camera')
content = content.replace('Nha Thong Minh', 'Nhà Thông Minh')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done - Vietnamese text fixed')
