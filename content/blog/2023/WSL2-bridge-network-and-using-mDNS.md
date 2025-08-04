---
date: 2023-01-19
description: 本文介绍了如何为WSL2启用桥接网络模式，使其获得独立的局域网IP。内容包括在Hyper-V中创建虚拟交换机、修改`.wslconfig`文件。同时，还讲解了如何在WSL2中安装并启用`avahi-daemon`服务，以实现通过mDNS（如`wsl.local`）进行主机名访问。
tags: ["WSL2", "Network", "mDNS"]
---

# WSL2 启用桥接网络并开启 mDNS

1. WSL2 启用桥接网络

首先在`Hyper-V管理器`中创建新的虚拟交换机（假设名字为 eth_switch），并选择外部网络和要桥接道德物理网卡。

编辑 window 主目录下.wslconfig 文件，添加两行配置

```
#C:\Users\<user_name>\.wslconfig
[wsl2]
#...
networkingMode=bridged
vmSwitch=eth_switch
```

重启 WSL2 后，eth0 将和物理网卡一样获取一个独立 ip

2. 启用 avahi-daemon.service 服务实现 mDNS 广播

```
# 安装
sudo apt-get install avahi-daemon
# 启动
systemctl start avahi-daemon.service
# 配置自动启动
systemctl enable avahi-daemon.service
```

配置 WSL2 计算机名
修改文件`/etc/wsl.conf`

```
[network]
hostname = wsl
```

重启之后便可以在局域网内通过计算机名 wsl 访问 wsl 了

```
PS C:\Users\fly92> ping wsl

正在 Ping wsl.local [192.168.10.164] 具有 32 字节的数据:
来自 192.168.10.164 的回复: 字节=32 时间<1ms TTL=64
来自 192.168.10.164 的回复: 字节=32 时间<1ms TTL=64
来自 192.168.10.164 的回复: 字节=32 时间<1ms TTL=64
来自 192.168.10.164 的回复: 字节=32 时间<1ms TTL=64

192.168.10.164 的 Ping 统计信息:
    数据包: 已发送 = 4，已接收 = 4，丢失 = 0 (0% 丢失)，
往返行程的估计时间(以毫秒为单位):
    最短 = 0ms，最长 = 0ms，平均 = 0ms
```

### 参考

1. [WSL 中的高级设置配置](https://learn.microsoft.com/zh-cn/windows/wsl/wsl-config)
