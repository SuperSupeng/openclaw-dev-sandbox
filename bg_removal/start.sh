#!/bin/bash

# 启动rembg HTTP服务器（端口5000）
rembg s --port 5000 &

# 等待rembg服务器启动
sleep 2

# 启动静态文件服务器（端口8000）
cd /app/web && python -m http.server 8000