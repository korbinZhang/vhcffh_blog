---
title: 'Nginx日志统计技巧'
date: 2025-12-18
---

记录如何通过命令行对Nginx日志进行简单分析，日志格式为：

```bash
log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';
```

1. 统计所有请求的总数（PV）

   ```bash
   awk '{print $1}' /var/log/nginx/access.log | wc -l
   ```
2. 统计独立IP的访问数量（UV）

   ```bash
   awk '{print $1}' /var/log/nginx/access.log | sort | uniq | wc -l
   ```
3. 按IP访问次数排序，显示前100个

   ```bash
   awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -n 100
   ```
4. 查看访问最频繁的页面（前50名）

   ```bash
   awk '{print $7}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -n 50
   ```
5. 排除静态资源（如JS、CSS）后，查看最频繁页面

   ```bash
   grep -vE '.js|.css|.ico' /var/log/nginx/access.log | awk '{print $7}' | sort | uniq -c | sort -rn | head -n 50
   ```
6. 统计每秒请求数，显示Top 100时间点

   ```bash
   awk '{print $4}' /var/log/nginx/access.log | cut -c 14-21 | sort | uniq -c | sort -rn | head -n 100
   ```
7. 列出传输时间超过3秒的页面（前20条）

   ```bash
   awk '($NF > 3){print $7}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -20
   ```


