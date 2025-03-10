---
date: 2025-03-04
---

# Git下载构建Linux

在本文中，我将介绍如何使用 Git 从官方仓库下载最新版 Linux 内核源码，然后进行配置、编译构建并安装。无论你是开发者、系统管理员还是 Linux 爱好者，这篇文章都能为你提供详细的步骤。

## 源代码下载

Linux 内核源码托管在 [kernel.org](https://www.kernel.org/) 的 Git 仓库中。
Linux 的最新版本是 mainline 。
进入[官网](https://www.kernel.org/)，点击 mainline 行的browse。
点击summary，获取最新 linux 版本的 Git 地址。

打开终端，执行以下命令开始克隆内核源码（仓库体积较大，可能需要较长时间）：

```bash
git clone https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git
```

> **提示**：克隆完成后，所有历史提交记录都会下载到本地。如果只想获取最新的代码，可以使用 `--depth` 参数来进行浅克隆
>
> ```bash
> git clone --depth=1 https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git
> ```

进入下载好的源码目录：

```bash
cd linux
```

## 配置内核源码

在开始编译之前，需要对内核进行配置。可以选择图形界面配置或基于已有配置文件的方式进行设置。

### 图形界面配置

确保安装了必要的依赖（`libncurses5-dev` 或 `libncurses-dev`），然后运行：

```bash
make menuconfig
```

### 使用现有配置文件

你可以复制当前系统正在使用的内核配置文件，然后更新配置：

```bash
cp /boot/config-$(uname -r) .config
make oldconfig
```

在配置过程中，根据需要启用或禁用内核选项。大多数用户保留默认配置即可。

### 生成arm64配置

```base
make ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- defconfig
```

## 编译与构建内核

配置完成后，就可以编译内核。编译过程需要一些时间，这取决于你的硬件性能和选择的配置选项。

使用以下命令启动编译，`-j$(nproc)` 参数会自动利用所有 CPU 核心，加速编译过程：

```bash
make ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- -j$(nproc)
make -j$(nproc)
```

编译结束后，你会在源码目录下看到编译生成的各类目标文件和模块。

## 安装新版内核

编译完成后，接下来可以安装内核模块及内核本身。

### 安装内核模块

首先安装编译好的内核模块：

```bash
sudo make modules_install
```

### 安装内核

然后安装内核文件及更新启动项：

```bash
sudo make install
```

通常，这一步会将内核文件和相关配置安装到 `/boot` 目录，并自动更新 GRUB 引导菜单。

### 手动更新 GRUB

在部分系统中，你可能需要手动更新 GRUB 配置：

```bash
sudo update-grub
```

## 重启并验证内核版本

安装完成后，重启计算机。在启动菜单中选择新安装的内核版本。重启后，可通过以下命令验证当前运行的内核版本：

```bash
uname -r
```

