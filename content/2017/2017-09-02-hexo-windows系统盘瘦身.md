+++
title = "windows系统盘瘦身"
date = 2017-09-02

[taxonomies]
categories = ["系统"]
tags = ["Windows", "系统瘦身"]
+++

C盘满了，瘦一下身

### 1.关闭系统休眠功能

删除Hiberfil.sys文件\
管理员运行cmd输入下面命令\
`powercfg -h of`

2.设置虚拟内存

控制面板---\>(系统和安全)---\>系统---\>高级系统设置---\>(高级)---\>设置---\>(高级)---\>更改\
把虚拟内存设置到其它盘

### 3.删除临时文件

以下三个目录里的文件是临时文件，可以删除\
C:\\windows\\temp\
C:\\ProgramData\\TEMP\
C:\\Users\\你的用户名\\AppData\\Local\\Temp
