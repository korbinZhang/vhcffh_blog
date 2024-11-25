---
date: 2024-08-04T04:44:04.177Z
updated: null
title: riscv工具链在 wsl 上出现 Segmentation fault
slug: riscv-wsl-segmentation-fault
oid: 66af07148a673ddcc44b9897
categories: 软件
type: post
permalink: /posts/软件/riscv-wsl-segmentation-fault
---


BK7235 的开发环境需要用到 RISCV 工具链，下载官方的工具链 [toolchain_v5.2.1.tar.gz](https://dl.bekencorp.com/tools/toolchain/riscv), 在 WSL 下编译 C 源码的时候出现 Segmentation fault 错误，运行不了。主要原因是 vsyscall 没开启导致的，WSL 开启 vsyscall 即可解决。


WSL 开启 vsyscall 的方法如下：

在用户根目录创建配置文件 .wslconfig，在 wsl2 下添加`kernelCommandLine = vsyscall=emulate`

```
[wsl2]
kernelCommandLine = vsyscall=emulate
```


**参考**

1. [riscv32-elf-gcc在archlinux上直接Segmentation fault](https://bbs.archlinuxcn.org/viewtopic.php?id=13753)
2. [vsyscall是什么](https://tinylab.org/riscv-syscall-part3-vdso-overview/)
3. [wsl配置](https://learn.microsoft.com/zh-cn/windows/wsl/wsl-config#main-wsl-settings)