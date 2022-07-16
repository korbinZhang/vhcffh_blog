+++
title = "简单的iptables配置过程"
date = 2018-10-19

[taxonomies]
categories = ["软件"]
tags = ["iptables","服务器", "系统"]
+++

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
