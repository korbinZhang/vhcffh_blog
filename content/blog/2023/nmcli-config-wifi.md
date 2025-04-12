---
date: 2023-01-09
---

# nmcli 配置 wifi

## 连接 wifi

### 扫描 wifi

```bash
sudo nmcli dev wifi list
```

### 连接新的 wifi

```bash
sudo nmcli dev wifi connect NETWORK-SSID password "NETWORK-PASSWORD"
```

### 查看保存的 wifi 信息

```bash
nmcli con show
```

### 连接保存在 wifi

```bash
nmcli con up NETWORK-SSID
```

### 断开 wifi

```bash
nmcli con down NETWORK-SSID
```

## 创建 wifi 热点

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

### 配置 dhcp

```bash
# vim /etc/dhcp/dhcpd.conf

option domain-name-servers 8.8.8.8;
subnet 192.168.44.0 netmask 255.255.255.0 {       # 目标网段
    range 192.168.44.128 192.168.44.200;          # 具体的IP
    option routers 192.168.44.1;                  # 网关地址
    option domain-name-servers 114.114.114.114;   # dns解析
}
```

### 启动 dhcp 服务

```bash
systemctl restart dhcpd
```
