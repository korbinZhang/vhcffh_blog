+++
title = "nmcli配置wifi"
date = 2023-01-09

[taxonomies]
categories = ["系统"]
tags = ["nmcli","wifi"]

[extra]
toc = true
+++

## 连接wifi
### 扫描wifi
```bash
sudo nmcli dev wifi list
```

### 连接新的wifi
```bash
sudo nmcli dev wifi connect NETWORK-SSID password "NETWORK-PASSWORD"
```

### 查看保存的wifi信息
```bash
nmcli con show 
```

### 连接保存在wifi
```bash
nmcli con up NETWORK-SSID
```

### 断开wifi 
```bash
nmcli con down NETWORK-SSID
```

## 创建wifi热点

### 创建热点
```bash
nmcli connection add type wifi ifname wlan0 con-name local-ap autoconnect yes ssid WIFI-SSID mode ap
```

### 设置密码
```bash
nmcli connection modify local-ap 802-11-wireless.mode ap 802-11-wireless-security.key-mgmt wpa-psk ipv4.method shared 802-11-wireless-security.psk "PASSWORD"
```

### 启动热点
```bash
nmcli connection up local-ap
```

### 配置dhcp
```bash
# vim /etc/dhcp/dhcpd.conf

option domain-name-servers 8.8.8.8;
subnet 192.168.44.0 netmask 255.255.255.0 {       # 目标网段
    range 192.168.44.128 192.168.44.200;          # 具体的IP  
    option routers 192.168.44.1;                  # 网关地址
    option domain-name-servers 114.114.114.114;   # dns解析
}
```

### 启动dhcp服务
```bash
systemctl restart dhcpd
```
