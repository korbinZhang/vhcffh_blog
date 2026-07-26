---
date: 2026-02-09
description: 记录Linux下自动挂载硬盘，并通过smb共享到局域网的方法。
tags: ["Linux", "Samba", "SMB", "Mount"]
---

# Linux自动挂载硬盘并共享

记录linux下自动挂载硬盘，并通过smb共享到网络中。

## 自动挂载

1. `blkid`查看 `UUID`

   ```bash
   korbin@pi:~ $ blkid
   /dev/mmcblk0p1: LABEL_FATBOOT="bootfs" LABEL="bootfs" UUID="F587-071F" BLOCK_SIZE="512" TYPE="vfat" PARTUUID="7d559f21-01"
   /dev/mmcblk0p2: LABEL="rootfs" UUID="d6944274-f2f7-4644-96a4-213c3b367f5c" BLOCK_SIZE="4096" TYPE="ext4" PARTUUID="7d559f21-02"
   /dev/loop0: TYPE="swap"
   /dev/sda1: UUID="5a9e8d37-1d53-45d1-b724-2695d70477f0" BLOCK_SIZE="4096" TYPE="ext4" PARTUUID="075b7ae2-de80-4a87-8c01-f028b9ad8cf0"
   /dev/zram0: LABEL="zram0" UUID="a7f80131-092f-412c-ae98-dec1724993ed" TYPE="swap"
   ```
2. 修改 `/etc/fstab`实现启动自动挂载

   ```bash
   sudo mkdir /mnt/disk1
   sudo echo "UUID=5a9e8d37-1d53-45d1-b724-2695d70477f0  /mnt/disk1  ext4  defaults  0  0" >> /etc/fstab
   ```

## smb共享

1. 安装 `samba`
   ```bash
   sudo apt install samba
   ```
2. 配置 `smb`共享
   ```bash
   [disk1]
      comment = Public Shared Data
      available = yes
      valid users = frey
      path = /mnt/disk1
      browseable = yes
      writeable = yes
      guest ok = no
      create mask = 0664
      directory mask = 0755
      force user = frey
   ```
3. 重启 `smb`服务
   ```bash
   sudo systemctl restart smb.service
   ```

