---
date: 2022-08-02
description: "本文记录在两台windows间转移WSL子系统时遇到的一些网络问题及解决方案"
---

# WSL转移后无法入网



## 缘由
新组装了一台台式机，需要将笔记本中的WSL子系统导出到新的台式机中，在转移过程中遇到了子系统DNS解析不正常和子系统与Host端口映射问题，在此进行一些记录。

## 系统导出

```powershell
# wsl --export <发行版> <FileName> [选项]
wsl --export Linux linux.tar
```

## 系统导入

导入系统时，在新系统上执行`wsl --help`命令后没有`--import`选项；查找原因后发现需要wsl进行升级，安装[教程](https://docs.microsoft.com/zh-cn/windows/wsl/basic-commands#set-wsl-version-to-1-or-2)对wsl进行升级；旧版wsl可能需要进行手动安装[教程](https://docs.microsoft.com/zh-cn/windows/wsl/install-manual)。更新后导入即可

```powershell
# wsl --import <发行版> <InstallLocation> <FileName> [选项]
wsl --import Linux d:/Linux/ linux.tar
```
尽量按照到非系统盘，保留系统盘空间

## 网络重置

导入系统后，系统无法联网，首先查看子系统机host的ip地址情况
```bash
$ ifconfig
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.23.202.215  netmask 255.255.240.0  broadcast 172.23.207.255
        inet6 fe80::215:5dff:feb6:259d  prefixlen 64  scopeid 0x20<link>
        ether 00:15:5d:b6:25:9d  txqueuelen 1000  (Ethernet)
        RX packets 19  bytes 4618 (4.5 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 30  bytes 1692 (1.6 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 18  bytes 1546 (1.5 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 18  bytes 1546 (1.5 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

$ route
Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
default         172.23.192.1    0.0.0.0         UG    0      0        0 eth0
172.23.192.0    0.0.0.0         255.255.240.0   U     0      0        0 eth0
```

```cmd
ipconfig
以太网适配器 vEthernet (WSL):

    连接特定的 DNS 后缀 . . . . . . . :
    本地链接 IPv6 地址. . . . . . . . : fe80::6dfb:1789:6e91:f5dd%48
    自动配置 IPv4 地址  . . . . . . . : 169.254.245.221
    子网掩码  . . . . . . . . . . . . : 255.255.0.0
    默认网关. . . . . . . . . . . . . :
```

主机WSL虚拟网卡地址与wsl子系统地址不在一个网段，需要重置主机网络

```cmd
wsl --shutdown
netsh winsock reset
netsh int ip reset all
netsh winhttp reset proxy
ipconfig /flushdns
```

## 防火墙配置

经过网络重置后，子系统应该可以ping通主机ip，如果无法ping通，可能是windows防火墙配置问题，对windows防火墙添加一条规则

```powershell
New-NetFirewallRule -DisplayName "WSL" -Direction Inbound  -InterfaceAlias "vEthernet (WSL)"  -Action Allow
```

## DNS解析问题

如果仅仅可以ping通ip，而不能ping通域名，那是域名解析出现了问题
应该是在导入后域名解析出现了问题，一般是由于文件'/etc/resolv.conf'引起的，有两种方式可以处理

1. 配置此文件自动生成

在文件`/etc/wsl.conf`中注释掉下面一行，这样在wsl重启后会自动生成文件`/etc/resolv.conf`

```
[network]
#generateResolvConf = false
```

2. [自己创建此文件](https://blog.vhcffh.com/wp-675/)

建议用这种方式，可以在子系统中自定义域名解析服务器

```bash
sudo rm /etc/resolv.conf
sudo bash -c 'echo "nameserver 8.8.8.8" > /etc/resolv.conf'
sudo bash -c 'echo "[network]" > /etc/wsl.conf'
sudo bash -c 'echo "generateResolvConf = false" >> /etc/wsl.conf'
sudo chattr +i /etc/resolv.conf
```

首先删除文件，然后新建此文件并重新配置wsl.conf文件，最后chattr命令是更改此文件属性（没有这一句wsl重启后resolv.conf文件会消失）

## 端口直接映射问题

在原本的笔记本中，子系统开启的端口（不论是127.0.0.1还是0.0.0.0）都可以在windows中的127.0.0.1直接访问，但在新系统中无法实现

经排查是进程wslhost.exe的问题，主要是window系统版本不同引起的
在windows更新中加入预览版体验，跟新系统版本到22H2后wsl的端口直接映射功能就有了，而且增加了子系统的窗口组件，可以直接运行子系统的窗口应用了
并且要更新wsl
```cmd
wsl --update
```

但经测试wsl中端口大于2610的仍无法直接映射，原因不明

## 参考

1. [WSL基本命令](https://docs.microsoft.com/zh-cn/windows/wsl/basic-commands) 
2. [旧版 WSL 的手动安装步骤](https://docs.microsoft.com/zh-cn/windows/wsl/install-manual)
3. [WSL2联网问题](https://blog.vhcffh.com/wp-675/)

