---
date: 2019-09-09
tags: ["Nvidia", "Linux", "Driver"]
description: 本文记录了一次解决Linux系统下Nvidia显卡驱动错误的经历。在使用`bumblebee`进行双显卡切换时，`optirun`命令报错“Failed to load module "nouveau"”。作者通过修改`/etc/bumblebee/xorg.conf.nouveau`文件，取消对`BusID`的注释并正确指定显卡PCI地址，最终成功禁用了nouveau开源驱动，并加载了nvidia专有驱动。
---

# nvidia显卡驱动错误



系统使用`bumblebee`实现双显卡(N卡和集成显卡)切换，\
同时有N卡的开源驱动nouveau和专有显卡驱动nvidia

使用命令

    optirun glxspheres64
    # 或者optirun glxspher

出现错误`[XORG] (EE) Failed to load module "nouveau"`\
通过命令`lsmod |grep nouveau`\
显示模块已经加载

通过`/etc/modprobe.d/blacklist.conf`文件禁用`nouveau`(需要重建内核`mkinitcpio -P`并重启),但`nouveau`驱动仍然加载了，`nvidia`未加载

解决方法修改文件`/etc/bumblebee/xorg.conf.nouveau`\
去掉`BusID "PCI:01:00:0"`的注释\
`PCI:01:00:0`通过命令`lspci | egrep (3D|VGA)`

重启后`nvidia`驱动加载成功,`nouveau`没有加载
