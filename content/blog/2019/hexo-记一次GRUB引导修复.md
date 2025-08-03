---
date: 2019-09-03
tags: ["GRUB", "Linux", "Dual Boot"]
---

# 记一次GRUB引导修复



使用Arch Linux已经2年多了，基本上已经习惯了，可前段时间英雄联盟也出了"自走棋"，想要体验一把。
于是就在硬盘剩余的60多个G上装了Windows 10，用了一两个月没有问题，最后在一次Windows 10更新后，蓝屏了。
又手惨的点了Windows 的修复功能。等了半天，结果是修复，重启，蓝屏无限循环。
而且Arch Linux的引导全都没了，感觉应该是Windows的修复动了efi分区。
无奈只能重新修复引导，各种方法尝试了好多遍，都是卡在了`GRUB _`一直闪这个状态，
最终在官网wiki找到了办法 [缺省/后备启动路径](https://wiki.archlinux.org/index.php/GRUB_#Default/fallback_boot_path) grub 安装时添加`--removable`参数

```bash
grub-install --target=x86_64-efi --efi-directory=esp --removable
```

或者手动移动
```bash
mv esp/EFI/grub esp/EFI/BOOT
mv esp/EFI/BOOT/grubx64.efi esp/EFI/BOOT/BOOTX64.EFI
```

grub出现bug的原因应该会千奇百怪，要尽可能多的尝试网上的各种修改方法。
