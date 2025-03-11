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
make ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- -j6
```

编译结束后，你会在源码目录下看到编译生成的各类目标文件和模块。

## 运行内核

使用命令运行编译后的内核

```bash
qemu-system-aarch64 -machine virt -cpu cortex-a53  -nographic -smp 1 -m 2048 -kernel arch/arm64/boot/Image
```

可以看到启动成功，但是没有挂载上文件系统，就`kernel panic`

```bash
❯ qemu-system-aarch64 -machine virt -cpu cortex-a53  -nographic -smp 1 -m 2048 -kernel arch/arm64/boot/Image
[    0.000000] Booting Linux on physical CPU 0x0000000000 [0x410fd034]
[    0.000000] Linux version 6.14.0-rc5-00013-g99fa936e8e4f (frey@wsl) (aarch64-linux-gnu-gcc (GCC) 14.2.0, GNU ld (GNU Binutils) 2.43) #2 SMP PREEMPT Mon Mar 10 22:25:13 CST 2025
[    0.000000] KASLR enabled
[    0.000000] random: crng init done
[    0.000000] Machine model: linux,dummy-virt
[    0.000000] efi: UEFI not found.
[    0.000000] OF: reserved mem: Reserved memory: No reserved-memory node in the DT
[    0.000000] NUMA: Faking a node at [mem 0x0000000040000000-0x00000000bfffffff]
[    0.000000] NODE_DATA(0) allocated [mem 0xbfbfb980-0xbfbfdfbf]
[    0.000000] Zone ranges:
[    0.000000]   DMA      [mem 0x0000000040000000-0x00000000bfffffff]
[    0.000000]   DMA32    empty
[    0.000000]   Normal   empty
[    0.000000] Movable zone start for each node
[    0.000000] Early memory node ranges
[    0.000000]   node   0: [mem 0x0000000040000000-0x00000000bfffffff]
[    0.000000] Initmem setup node 0 [mem 0x0000000040000000-0x00000000bfffffff]
[    0.000000] cma: Reserved 32 MiB at 0x00000000bba00000 on node -1
[    0.000000] psci: probing for conduit method from DT.
[    0.000000] psci: PSCIv1.1 detected in firmware.
[    0.000000] psci: Using standard PSCI v0.2 function IDs
[    0.000000] psci: Trusted OS migration not required
[    0.000000] psci: SMC Calling Convention v1.0
[    0.000000] percpu: Embedded 25 pages/cpu s61592 r8192 d32616 u102400
[    0.000000] Detected VIPT I-cache on CPU0
[    0.000000] CPU features: kernel page table isolation forced ON by KASLR
[    0.000000] CPU features: detected: Kernel page table isolation (KPTI)
[    0.000000] CPU features: detected: ARM erratum 845719
[    0.000000] alternatives: applying boot alternatives
[    0.000000] Kernel command line:
[    0.000000] printk: log buffer data + meta data: 131072 + 458752 = 589824 bytes
[    0.000000] Dentry cache hash table entries: 262144 (order: 9, 2097152 bytes, linear)
[    0.000000] Inode-cache hash table entries: 131072 (order: 8, 1048576 bytes, linear)
[    0.000000] Fallback order for Node 0: 0
[    0.000000] Built 1 zonelists, mobility grouping on.  Total pages: 524288
[    0.000000] Policy zone: DMA
[    0.000000] mem auto-init: stack:all(zero), heap alloc:off, heap free:off
[    0.000000] software IO TLB: SWIOTLB bounce buffer size adjusted to 2MB
[    0.000000] software IO TLB: area num 1.
[    0.000000] software IO TLB: mapped [mem 0x00000000bb600000-0x00000000bb800000] (2MB)
[    0.000000] SLUB: HWalign=64, Order=0-3, MinObjects=0, CPUs=1, Nodes=1
[    0.000000] rcu: Preemptible hierarchical RCU implementation.
[    0.000000] rcu:     RCU event tracing is enabled.
[    0.000000] rcu:     RCU restricting CPUs from NR_CPUS=512 to nr_cpu_ids=1.
[    0.000000]  Trampoline variant of Tasks RCU enabled.
[    0.000000]  Tracing variant of Tasks RCU enabled.
[    0.000000] rcu: RCU calculated value of scheduler-enlistment delay is 25 jiffies.
[    0.000000] rcu: Adjusting geometry for rcu_fanout_leaf=16, nr_cpu_ids=1
[    0.000000] RCU Tasks: Setting shift to 0 and lim to 1 rcu_task_cb_adjust=1 rcu_task_cpu_ids=1.
[    0.000000] RCU Tasks Trace: Setting shift to 0 and lim to 1 rcu_task_cb_adjust=1 rcu_task_cpu_ids=1.
[    0.000000] NR_IRQS: 64, nr_irqs: 64, preallocated irqs: 0
[    0.000000] Root IRQ handler: gic_handle_irq
[    0.000000] GICv2m: range[mem 0x08020000-0x08020fff], SPI[80:143]
[    0.000000] rcu: srcu_init: Setting srcu_struct sizes based on contention.
[    0.000000] arch_timer: cp15 timer(s) running at 62.50MHz (virt).
[    0.000000] clocksource: arch_sys_counter: mask: 0x1ffffffffffffff max_cycles: 0x1cd42e208c, max_idle_ns: 881590405314 ns
[    0.000061] sched_clock: 57 bits at 63MHz, resolution 16ns, wraps every 4398046511096ns
[    0.010953] Console: colour dummy device 80x25
[    0.011631] printk: legacy console [tty0] enabled
[    0.016729] Calibrating delay loop (skipped), value calculated using timer frequency.. 125.00 BogoMIPS (lpj=250000)
[    0.016954] pid_max: default: 32768 minimum: 301
[    0.018494] LSM: initializing lsm=capability
[    0.021314] Mount-cache hash table entries: 4096 (order: 3, 32768 bytes, linear)
[    0.021419] Mountpoint-cache hash table entries: 4096 (order: 3, 32768 bytes, linear)
[    0.052601] cacheinfo: Unable to detect cache hierarchy for CPU 0
[    0.073827] rcu: Hierarchical SRCU implementation.
[    0.073945] rcu:     Max phase no-delay instances is 1000.
[    0.082111] EFI services will not be available.
[    0.082833] smp: Bringing up secondary CPUs ...
[    0.084629] smp: Brought up 1 node, 1 CPU
[    0.084720] SMP: Total of 1 processors activated.
[    0.084770] CPU: All CPU(s) started at EL1
[    0.085034] CPU features: detected: 32-bit EL0 Support
[    0.085072] CPU features: detected: 32-bit EL1 Support
[    0.085161] CPU features: detected: CRC32 instructions
[    0.099130] alternatives: applying system-wide alternatives
[    0.123449] Memory: 1978696K/2097152K available (17728K kernel code, 5150K rwdata, 12208K rodata, 3072K init, 744K bss, 82340K reserved, 32768K cma-reserved)
[    0.152982] devtmpfs: initialized
[    0.178128] clocksource: jiffies: mask: 0xffffffff max_cycles: 0xffffffff, max_idle_ns: 7645041785100000 ns
[    0.178750] futex hash table entries: 256 (order: 2, 16384 bytes, linear)
[    0.182446] 2G module region forced by RANDOMIZE_MODULE_REGION_FULL
[    0.182559] 0 pages in range for non-PLT usage
[    0.182617] 514496 pages in range for PLT usage
[    0.186387] pinctrl core: initialized pinctrl subsystem
[    0.196332] DMI not present or invalid.
[    0.219290] NET: Registered PF_NETLINK/PF_ROUTE protocol family
[    0.230164] DMA: preallocated 256 KiB GFP_KERNEL pool for atomic allocations
[    0.231152] DMA: preallocated 256 KiB GFP_KERNEL|GFP_DMA pool for atomic allocations
[    0.232221] DMA: preallocated 256 KiB GFP_KERNEL|GFP_DMA32 pool for atomic allocations
[    0.232649] audit: initializing netlink subsys (disabled)
[    0.237149] audit: type=2000 audit(0.208:1): state=initialized audit_enabled=0 res=1
[    0.242673] thermal_sys: Registered thermal governor 'step_wise'
[    0.242743] thermal_sys: Registered thermal governor 'power_allocator'
[    0.243272] cpuidle: using governor menu
[    0.244689] hw-breakpoint: found 6 breakpoint and 4 watchpoint registers.
[    0.245377] ASID allocator initialised with 32768 entries
[    0.252209] Serial: AMBA PL011 UART driver
[    0.316980] 9000000.pl011: ttyAMA0 at MMIO 0x9000000 (irq = 13, base_baud = 0) is a PL011 rev1
[    0.318820] printk: legacy console [ttyAMA0] enabled
[    0.407534] HugeTLB: registered 1.00 GiB page size, pre-allocated 0 pages
[    0.408045] HugeTLB: 0 KiB vmemmap can be freed for a 1.00 GiB page
[    0.408352] HugeTLB: registered 32.0 MiB page size, pre-allocated 0 pages
[    0.408691] HugeTLB: 0 KiB vmemmap can be freed for a 32.0 MiB page
[    0.409266] HugeTLB: registered 2.00 MiB page size, pre-allocated 0 pages
[    0.410754] HugeTLB: 0 KiB vmemmap can be freed for a 2.00 MiB page
[    0.411163] HugeTLB: registered 64.0 KiB page size, pre-allocated 0 pages
[    0.411589] HugeTLB: 0 KiB vmemmap can be freed for a 64.0 KiB page
[    0.422530] ACPI: Interpreter disabled.
[    0.429665] iommu: Default domain type: Translated
[    0.429974] iommu: DMA domain TLB invalidation policy: strict mode
[    0.432015] SCSI subsystem initialized
[    0.434719] usbcore: registered new interface driver usbfs
[    0.435215] usbcore: registered new interface driver hub
[    0.435988] usbcore: registered new device driver usb
[    0.438373] pps_core: LinuxPPS API ver. 1 registered
[    0.438699] pps_core: Software ver. 5.3.6 - Copyright 2005-2007 Rodolfo Giometti <giometti@linux.it>
[    0.439186] PTP clock support registered
[    0.439959] EDAC MC: Ver: 3.0.0
[    0.441633] scmi_core: SCMI protocol bus registered
[    0.451134] FPGA manager framework
[    0.452112] Advanced Linux Sound Architecture Driver Initialized.
[    0.466163] vgaarb: loaded
[    0.468516] clocksource: Switched to clocksource arch_sys_counter
[    0.473167] VFS: Disk quotas dquot_6.6.0
[    0.473598] VFS: Dquot-cache hash table entries: 512 (order 0, 4096 bytes)
[    0.475572] pnp: PnP ACPI: disabled
[    0.498996] NET: Registered PF_INET protocol family
[    0.500966] IP idents hash table entries: 32768 (order: 6, 262144 bytes, linear)
[    0.508950] tcp_listen_portaddr_hash hash table entries: 1024 (order: 2, 16384 bytes, linear)
[    0.509902] Table-perturb hash table entries: 65536 (order: 6, 262144 bytes, linear)
[    0.510513] TCP established hash table entries: 16384 (order: 5, 131072 bytes, linear)
[    0.511574] TCP bind hash table entries: 16384 (order: 7, 524288 bytes, linear)
[    0.513749] TCP: Hash tables configured (established 16384 bind 16384)
[    0.515960] UDP hash table entries: 1024 (order: 4, 65536 bytes, linear)
[    0.517155] UDP-Lite hash table entries: 1024 (order: 4, 65536 bytes, linear)
[    0.518956] NET: Registered PF_UNIX/PF_LOCAL protocol family
[    0.533079] RPC: Registered named UNIX socket transport module.
[    0.533441] RPC: Registered udp transport module.
[    0.533611] RPC: Registered tcp transport module.
[    0.533846] RPC: Registered tcp-with-tls transport module.
[    0.534094] RPC: Registered tcp NFSv4.1 backchannel transport module.
[    0.534610] PCI: CLS 0 bytes, default 64
[    0.536824] kvm [1]: HYP mode not available
[    0.546413] Initialise system trusted keyrings
[    0.548140] workingset: timestamp_bits=42 max_order=19 bucket_order=0
[    0.551637] squashfs: version 4.0 (2009/01/31) Phillip Lougher
[    0.554195] NFS: Registering the id_resolver key type
[    0.554994] Key type id_resolver registered
[    0.555354] Key type id_legacy registered
[    0.555904] nfs4filelayout_init: NFSv4 File Layout Driver Registering...
[    0.557397] nfs4flexfilelayout_init: NFSv4 Flexfile Layout Driver Registering...
[    0.558893] 9p: Installing v9fs 9p2000 file system support
[    0.626086] Key type asymmetric registered
[    0.626427] Asymmetric key parser 'x509' registered
[    0.627092] Block layer SCSI generic (bsg) driver version 0.4 loaded (major 245)
[    0.627747] io scheduler mq-deadline registered
[    0.628482] io scheduler kyber registered
[    0.629287] io scheduler bfq registered
[    0.655255] pl061_gpio 9030000.pl061: PL061 GPIO chip registered
[    0.659715] ledtrig-cpu: registered to indicate activity on CPUs
[    0.664721] pci-host-generic 4010000000.pcie: host bridge /pcie@10000000 ranges:
[    0.665863] pci-host-generic 4010000000.pcie:       IO 0x003eff0000..0x003effffff -> 0x0000000000
[    0.667013] pci-host-generic 4010000000.pcie:      MEM 0x0010000000..0x003efeffff -> 0x0010000000
[    0.667599] pci-host-generic 4010000000.pcie:      MEM 0x8000000000..0xffffffffff -> 0x8000000000
[    0.669366] pci-host-generic 4010000000.pcie: Memory resource size exceeds max for 32 bits
[    0.671053] pci-host-generic 4010000000.pcie: ECAM at [mem 0x4010000000-0x401fffffff] for [bus 00-ff]
[    0.673373] pci-host-generic 4010000000.pcie: PCI host bridge to bus 0000:00
[    0.674164] pci_bus 0000:00: root bus resource [bus 00-ff]
[    0.674582] pci_bus 0000:00: root bus resource [io  0x0000-0xffff]
[    0.674966] pci_bus 0000:00: root bus resource [mem 0x10000000-0x3efeffff]
[    0.675380] pci_bus 0000:00: root bus resource [mem 0x8000000000-0xffffffffff]
[    0.677876] pci 0000:00:00.0: [1b36:0008] type 00 class 0x060000 conventional PCI endpoint
[    0.684199] pci 0000:00:01.0: [1af4:1000] type 00 class 0x020000 conventional PCI endpoint
[    0.685457] pci 0000:00:01.0: BAR 0 [io  0x0000-0x001f]
[    0.685782] pci 0000:00:01.0: BAR 1 [mem 0x00000000-0x00000fff]
[    0.686634] pci 0000:00:01.0: BAR 4 [mem 0x00000000-0x00003fff 64bit pref]
[    0.687649] pci 0000:00:01.0: ROM [mem 0x00000000-0x0003ffff pref]
[    0.690778] pci 0000:00:01.0: ROM [mem 0x10000000-0x1003ffff pref]: assigned
[    0.691667] pci 0000:00:01.0: BAR 4 [mem 0x8000000000-0x8000003fff 64bit pref]: assigned
[    0.692282] pci 0000:00:01.0: BAR 1 [mem 0x10040000-0x10040fff]: assigned
[    0.693232] pci 0000:00:01.0: BAR 0 [io  0x1000-0x101f]: assigned
[    0.693941] pci_bus 0000:00: resource 4 [io  0x0000-0xffff]
[    0.694504] pci_bus 0000:00: resource 5 [mem 0x10000000-0x3efeffff]
[    0.695383] pci_bus 0000:00: resource 6 [mem 0x8000000000-0xffffffffff]
[    0.758592] virtio-pci 0000:00:01.0: enabling device (0000 -> 0003)
[    0.776913] Serial: 8250/16550 driver, 4 ports, IRQ sharing enabled
[    0.786524] msm_serial: driver initialized
[    0.787566] SuperH (H)SCI(F) driver initialized
[    0.788711] STM32 USART driver initialized
[    0.817222] loop: module loaded
[    0.819956] megasas: 07.727.03.00-rc1
[    0.825879] physmap-flash 0.flash: physmap platform flash device: [mem 0x00000000-0x03ffffff]
[    0.828468] 0.flash: Found 2 x16 devices at 0x0 in 32-bit bank. Manufacturer ID 0x000000 Chip ID 0x000000
[    0.829623] Intel/Sharp Extended Query Table at 0x0031
[    0.831260] Using buffer write method
[    0.832620] physmap-flash 0.flash: physmap platform flash device: [mem 0x04000000-0x07ffffff]
[    0.834380] 0.flash: Found 2 x16 devices at 0x0 in 32-bit bank. Manufacturer ID 0x000000 Chip ID 0x000000
[    0.835111] Intel/Sharp Extended Query Table at 0x0031
[    0.836804] Using buffer write method
[    0.837322] Concatenating MTD devices:
[    0.837526] (0): "0.flash"
[    0.837692] (1): "0.flash"
[    0.837952] into device "0.flash"
[    0.865829] tun: Universal TUN/TAP device driver, 1.6
[    0.883830] thunder_xcv, ver 1.0
[    0.884214] thunder_bgx, ver 1.0
[    0.884944] nicpf, ver 1.0
[    0.887822] hns3: Hisilicon Ethernet Network Driver for Hip08 Family - version
[    0.888112] hns3: Copyright (c) 2017 Huawei Corporation.
[    0.888873] hclge is initializing
[    0.889266] e1000: Intel(R) PRO/1000 Network Driver
[    0.889509] e1000: Copyright (c) 1999-2006 Intel Corporation.
[    0.890006] e1000e: Intel(R) PRO/1000 Network Driver
[    0.890429] e1000e: Copyright(c) 1999 - 2015 Intel Corporation.
[    0.891030] igb: Intel(R) Gigabit Ethernet Network Driver
[    0.891574] igb: Copyright (c) 2007-2014 Intel Corporation.
[    0.892397] igbvf: Intel(R) Gigabit Virtual Function Network Driver
[    0.893067] igbvf: Copyright (c) 2009 - 2012 Intel Corporation.
[    0.894384] sky2: driver version 1.30
[    0.899286] VFIO - User Level meta-driver version: 0.3
[    0.908820] usbcore: registered new interface driver usb-storage
[    0.920923] rtc-pl031 9010000.pl031: registered as rtc0
[    0.921877] rtc-pl031 9010000.pl031: setting system clock to 2025-03-11T12:15:46 UTC (1741695346)
[    0.924773] i2c_dev: i2c /dev entries driver
[    0.941260] sdhci: Secure Digital Host Controller Interface driver
[    0.941587] sdhci: Copyright(c) Pierre Ossman
[    0.943342] Synopsys Designware Multimedia Card Interface Driver
[    0.946224] sdhci-pltfm: SDHCI platform and OF driver helper
[    0.955270] usbcore: registered new interface driver usbhid
[    0.955680] usbhid: USB HID core driver
[    0.966204] hw perfevents: enabled with armv8_pmuv3 PMU driver, 7 (0,8000003f) counters available
[    0.981580] NET: Registered PF_PACKET protocol family
[    0.983268] 9pnet: Installing 9P2000 support
[    0.983923] Key type dns_resolver registered
[    1.006902] registered taskstats version 1
[    1.009045] Loading compiled-in X.509 certificates
[    1.028728] Demotion targets for Node 0: null
[    1.039448] input: gpio-keys as /devices/platform/gpio-keys/input/input0
[    1.049892] clk: Disabling unused clocks
[    1.050371] PM: genpd: Disabling unused power domains
[    1.050995] ALSA device list:
[    1.051202]   No soundcards found.
[    1.060111] /dev/root: Can't open blockdev
[    1.061434] VFS: Cannot open root device "" or unknown-block(0,0): error -6
[    1.062042] Please append a correct "root=" boot option; here are the available partitions:
[    1.062782] 1f00          131072 mtdblock0
[    1.062885]  (driver?)
[    1.063616] List of all bdev filesystems:
[    1.064152]  ext3
[    1.064179]  ext2
[    1.064706]  ext4
[    1.064930]  squashfs
[    1.065135]  vfat
[    1.065504]
[    1.066044] Kernel panic - not syncing: VFS: Unable to mount root fs on unknown-block(0,0)
[    1.067317] CPU: 0 UID: 0 PID: 1 Comm: swapper/0 Not tainted 6.14.0-rc5-00013-g99fa936e8e4f #2
[    1.067962] Hardware name: linux,dummy-virt (DT)
[    1.069456] Call trace:
[    1.069861]  show_stack+0x18/0x24 (C)
[    1.070978]  dump_stack_lvl+0x60/0x80
[    1.071317]  dump_stack+0x18/0x24
[    1.071691]  panic+0x168/0x360
[    1.072154]  mount_root_generic+0x1f8/0x2b0
[    1.072603]  mount_root+0x208/0x248
[    1.072918]  prepare_namespace+0x1d8/0x240
[    1.073664]  kernel_init_freeable+0x254/0x278
[    1.074329]  kernel_init+0x20/0x140
[    1.074665]  ret_from_fork+0x10/0x20
[    1.075455] Kernel Offset: 0x518503000000 from 0xffff800080000000
[    1.076354] PHYS_OFFSET: 0xfff0f0e3c0000000
[    1.076753] CPU features: 0x000,00000900,00800000,0200421b
[    1.077146] Memory Limit: none
[    1.078023] ---[ end Kernel panic - not syncing: VFS: Unable to mount root fs on unknown-block(0,0) ]---
```

## 添加根文件系统

### 配置内核支持

勾选上RAM block device support，也即CONFIG_BLK_DEV_RAM=y

```txt
Device Drivers  --->
[*] Block devices  --->
 <M>   RAM block device support
 (16)    Default number of RAM disks
 (4096)  Default RAM disk size (kbytes) (NEW)
```

重新编译

```bash
make ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- -j6
```

### 制作根文件系统

创建一个文件夹`initramfs`作为系统根目录，然后创建一个可执行程序`init.c


```c
// initramfs/init.c
#include <stdio.h>
#include <unistd.h>
int main()
{
    printf("hello world!\n");
    int count = 0;
    while (1) {
        printf("count: %d\n", count++);
        sleep(1);
    }
    return 0;
}
```

编程生成`init`启动文件

```bash
aarch64-linux-gnu-gcc init.c -o init -static
```

使用cpio打包文件系统

```bash
find . | cpio -o -H newc | gzip > initramfs.cpio.gz
```

## 运行带有跟文件系统的内核

```bash
qemu-system-aarch64 -machine virt -cpu cortex-a53 -nographic -smp 1 -m 2048 -kernel arch/arm64/boot/Image -append "root=/dev/ram0 rootfstype=ramfs rw init=/init"  -initrd initramfs.cpio.gz
```

按下`Ctrl + a`键，然后按下`x`键推出qemu

```txt
...
[    2.001303] Key type dns_resolver registered
[    2.045796] registered taskstats version 1
[    2.049218] Loading compiled-in X.509 certificates
[    2.079850] Demotion targets for Node 0: null
[    2.098945] input: gpio-keys as /devices/platform/gpio-keys/input/input0
[    2.116717] clk: Disabling unused clocks
[    2.117571] PM: genpd: Disabling unused power domains
[    2.118599] ALSA device list:
[    2.120375]   No soundcards found.
[    2.192567] Freeing unused kernel memory: 3072K
[    2.194741] Run /init as init process
hello world!
count: 0
count: 1
count: 2
count: 3
count: 4
count: 5
QEMU: Terminated
```

### qemu参数解释

- `-machine virt `：指定`qemu`模拟的设备，这里就是指一个通用的`armv8`架构的芯片
- `-cpu cortex-a53 `：指定具体的核心
- `-nographic`：表示启动时没有图形界面
- `-smp 1 `：设置该设备只有1个核
- `-m 2048 `：表示设置该设备有`2048MB`的内存
- `-kernel arch/arm64/boot/Image`：指定用于启动的内核文件
- `-initrd initramfs.cpio.gz`：表示指定使用这个文件作为`ramfs`的内容，也即我们自己生成的根文件系统
- `-append "root=/dev/ram0 rootfstype=ramfs rw init=/init`：表示了传递给内核的参数
  - `root` 表示根文件系统的设备为 `/dev/ram0`, 除此之外制定了文件系统的类型是 `ramfs`
  - `init` 表示系统启动的第一个进程名称，内核会从文件系统中加载该进程去执行
