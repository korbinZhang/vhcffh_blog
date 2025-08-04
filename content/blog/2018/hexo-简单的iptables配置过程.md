---
date: 2018-10-19
tags: ["iptables", "Linux"]
description: 本文记录了一个简单而实用的iptables防火墙配置流程，方便日后查阅。文章将配置过程总结为四个核心步骤：首先，清除所有旧的、自定义的规则；其次，为INPUT、OUTPUT、FORWARD等链设定默认的策略（如默认拒绝所有入站请求）；接着，根据需要添加具体的自定义规则，例如允许特定端口（如SSH的22端口）的TCP连接；最后，讲解了如何保存当前配置，以确保重启后规则依然生效。
---

# 简单的iptables配置过程



简单的记一下iptables的配置过程，以后用到了就不用再google了\
总的来说分为四步，清楚规则，预设规则，添加自定义规则，保存规则

iptables配置过程
---------------------------------------------------------------------

1.清除规则:

清楚旧的规则\
iptables -F 清除预设表filter中的所有规则链的规则\
iptables -X 清除预设表filter中使用者自定链中的规则

2.设定预设规则

默认情况下对各种包的处理方式\
iptables -p INPUT DROP\
iptables -p OUTPUT ACCEPT\
iptables -p FORWARD DROP

3.添加用户自定义规则

对于特定端口协议的包的规则进行设置\
iptables -A INPUT -p tcp ---dport 22 -j ACCEPT\
-A:表示添加规则到INPUT(OUTPUT,FORWARD)链\
-p:表示tcp(udp)协议\
---dport(---sport):目的端口号(源端口号)\
-j():添加规则为接受

4.保存规则

不保存的话重启后就没有了\
service iptables save

参考资料

1.<http://www.cnblogs.com/JemBai/archive/2009/03/19/1416364.html>
