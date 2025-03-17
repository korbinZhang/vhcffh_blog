---
date: 2025-03-11
---

# qemu 运行 busybox

在[上篇文章](./git-linux-build.md)中，通过编译linux内核，编写简单的C程序，实现基于内核运行程序。本篇文章实现在linux内核上运行busybox。

## 下载 busybox

在[busybox官网](https://git.busybox.net/busybox/)可以获取到最新的busybox源码，通过git下载。
本文编译v1.37.0。

```bash
git clone git://git.busybox.net/busybox
```

## 配置构建

生成默认配置

```bash
make defconfig
```

通过 `menuconfig` 配置static编译
```bash
Busybox Settings  --->
    Build Options  --->
        [*] Build BusyBox as a static binary (no shared libs) (NEW)
```

```bash
make menuconfig
```

```bash
❯ make menuconfig
 *** Unable to find the ncurses libraries or the
 *** required header files.
 *** 'make menuconfig' requires the ncurses libraries.
 ***
 *** Install ncurses (ncurses-devel) and try again.
 ***
make[2]: *** [/home/frey/workspace/git/os/busybox/scripts/kconfig/lxdialog/Makefile:15: scripts/kconfig/lxdialog/dochecklxdialog] Error 1
make[1]: *** [/home/frey/workspace/git/os/busybox/scripts/kconfig/Makefile:14: menuconfig] Error 2
make: *** [Makefile:444: menuconfig] Error 2
```

在wsl2运行archlinux编译时，遇到下面检测`ncurses-devel`出现的错误，但是已经安装了`ncurses`，通过gcc可以编译包含`<ncurses.h>`头文件的程序。

在文件`check-lxdialog.sh`中直接返回0,表示成功即可进行配置。

```bash
--- a/scripts/kconfig/lxdialog/check-lxdialog.sh
+++ b/scripts/kconfig/lxdialog/check-lxdialog.sh
@@ -44,11 +44,13 @@ tmp=.lxdialog.tmp
 trap "rm -f $tmp" 0 1 2 3 15

 # Check if we can link to ncurses
+# 直接返回0成功
 check() {
         $cc -x c - -o $tmp 2>/dev/null <<'EOF'
 #include CURSES_LOC
 main() {}
 EOF
+exit 0
```


编译

```bash
make -j6
```

遇到一些报错

```bash
networking/tc.c: In function 'cbq_print_opt':
networking/tc.c:236:27: error: 'TCA_CBQ_MAX' undeclared (first use in this function); did you mean 'TCA_CBS_MAX'?
  236 |         struct rtattr *tb[TCA_CBQ_MAX+1];
      |                           ^~~~~~~~~~~
      |                           TCA_CBS_MAX
networking/tc.c:236:27: note: each undeclared identifier is reported only once for each function it appears in
networking/tc.c:249:16: error: 'TCA_CBQ_RATE' undeclared (first use in this function); did you mean 'TCA_TBF_RATE64'?
  249 |         if (tb[TCA_CBQ_RATE]) {
      |                ^~~~~~~~~~~~
      |                TCA_TBF_RATE64
```

内核不再支持CBQ(Class-Based Queuing，一种流量控制和调度算法)，编辑`.config`文件，禁用`CONFIG_TC`可消除错误。
[参考](https://www.reddit.com/r/linuxquestions/comments/1cizfpo/id_like_some_help_with_this_youtube_guide/)

```bash
libbb/hash_md5_sha.c:1316:35: error: 'sha1_process_block64_shaNI' undeclared (first use in this function); did you mean 'sha1_process_block64'?
 1316 |          || ctx->process_block == sha1_process_block64_shaNI
      |                                   ^~~~~~~~~~~~~~~~~~~~~~~~~~
      |                                   sha1_process_block64
```

busybox的bug，arm架构没有`sha1_process_block64_shaNI`。[参考](https://lists.busybox.net/pipermail/busybox/2024-September/090944.html)

```bash
diff --git a/libbb/hash_md5_sha.c b/libbb/hash_md5_sha.c
index 57a801459..75a61c32c 100644
--- a/libbb/hash_md5_sha.c
+++ b/libbb/hash_md5_sha.c
@@ -1313,7 +1313,9 @@ unsigned FAST_FUNC sha1_end(sha1_ctx_t *ctx, void *resbuf)
        hash_size = 8;
        if (ctx->process_block == sha1_process_block64
 #if ENABLE_SHA1_HWACCEL
+# if defined(__GNUC__) && (defined(__i386__) || defined(__x86_64__))
         || ctx->process_block == sha1_process_block64_shaNI
+# endif
 #endif
        ) {
                hash_size = 5;
```

编译成功后，执行install，在`_install`目录生成boxbusy文件

```bash
make ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- -j6 install
```

## 打包根文件系统

```
cd _install
ln -s bin/busybox init
find . | cpio -o -H newc | gzip > initramfs.cpio.gz
```

## 运行

```bash
qemu-system-aarch64 -machine virt -cpu cortex-a53 -nographic -smp 1 -m 2048 -kernel arch/arm64/boot/Image -append "root=/dev/ram0 rootfstype=ramfs rw init=/init"  -initrd ../busybox/_install/initramfs.cpio.gz
```

```
[    1.117193] 9pnet: Installing 9P2000 support
[    1.117799] Key type dns_resolver registered
[    1.139603] registered taskstats version 1
[    1.141234] Loading compiled-in X.509 certificates
[    1.157385] Demotion targets for Node 0: null
[    1.168037] input: gpio-keys as /devices/platform/gpio-keys/input/input0
[    1.177580] clk: Disabling unused clocks
[    1.178038] PM: genpd: Disabling unused power domains
[    1.178810] ALSA device list:
[    1.179113]   No soundcards found.
[    1.222812] Freeing unused kernel memory: 3072K
[    1.223923] Run /init as init process
can't run '/etc/init.d/rcS': No such file or directory
can't open /dev/tty2: No such file or directory

can't open /dev/tty3: No such file or directory
can't open /dev/tty4: No such file or directory
can't open /dev/tty2: No such file or directory
ls
can't open /dev/tty3: No such file or directory
can't open /dev/tty4: No such file or directory
ls
bin                init               linuxrc            sbin
dev                initramfs.cpio.gz  root               usr
can't open /dev/tty2: No such file or directory

~ # ls
bin                init               linuxrc            sbin
dev                initramfs.cpio.gz  root               usr
can't open /dev/tty3: No such file or directory
can't open /dev/tty4: No such file or directory
```

对于`can't open /dev/tty4: No such file or directory`打包前创建tty终端即可

```bash
mknod dev/tty2 c 4 2
mknod dev/tty3 c 4 2
mknod dev/tty4 c 4 2
find . | cpio -o -H newc | gzip > initramfs.cpio.gz
```

