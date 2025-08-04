---
date: 2017-09-02
tags: ["Windows", "System"]
description: 本文提供了一些为Windows系统C盘进行“瘦身”的实用技巧，旨在解决系统盘空间不足的问题。文章主要介绍了三个有效的方法：一是通过命令行`powercfg -h off`关闭系统休眠功能，从而安全地删除占用大量空间的休眠文件（Hiberfil.sys）；二是将系统的虚拟内存（页面文件）从C盘移动到其他磁盘分区；三是清理系统中的临时文件，包括Windows的temp目录、ProgramData下的TEMP目录以及用户个人文件夹下的临时文件目录。
---

# windows系统盘瘦身



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
