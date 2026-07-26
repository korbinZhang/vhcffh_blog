---
date: 2026-04-30
title: STM32 Flash 读写与存储架构详解
description: 深入记录STM32F407存储外设的地址映射、ART加速器原理及Flash读写注意事项
tags: ["STM32", "Flash", "Embedded"]
---

在进行 STM32 嵌入式开发时，理解存储架构（Flash、SRAM、CCM RAM）及其访问特性是性能优化的基础。本文以 STM32F407 为例，总结其存储特性。

## 地址空间映射

STM32F407 拥有 4GB 的线性地址空间，其内部存储器的分配如下表所示：

| 类型            | 起始地址     | 总线连接      | 空间大小   | 特点                                             |
| :-------------- | :----------- | :------------ | :--------- | :----------------------------------------------- |
| **Flash**       | `0x08000000` | I-Bus / D-Bus | Up to 1 MB | 非易失性存储，存放程序代码和常量数据。           |
| **SRAM1**       | `0x20000000` | System Bus    | 112 KB     | 主系统 RAM，支持 DMA 访问。                      |
| **SRAM2**       | `0x2001C000` | System Bus    | 16 KB      | 辅助 RAM，常用于特定外设缓存。                   |
| **CCM RAM**     | `0x10000000` | D-Bus         | 64 KB      | **核心耦合存储器**。速度最快，但**不支持 DMA**。 |
| **Backup SRAM** | `0x40024000` | AHB Bus       | 4 KB       | 低功耗备份 RAM，Vbat 供电时数据不丢失。          |

## Flash 等待周期与 ART 加速器

STM32F407 的主频最高可达 168MHz，而内部 Flash 的访问频率通常较低（约 30MHz）。为了匹配 CPU 的高速处理能力，意法半导体引入了 **ART 加速器 (Adaptive Real-Time Accelerator)**。

### 1. 等待周期 (Wait States)

在不同的工作频率下，必须配置正确的等待周期（Latency）：

| HCLK 频率 (Vdd=3.3V) | 等待周期 (WS) |
| :------------------- | :------------ |
| 0 < HCLK ≤ 30 MHz    | 0 WS          |
| 30 < HCLK ≤ 60 MHz   | 1 WS          |
| 60 < HCLK ≤ 90 MHz   | 2 WS          |
| 150 < HCLK ≤ 168 MHz | **5 WS**      |

### 2. ART 加速器原理

ART 加速器包含：

- **128位预取队列**：每次从 Flash 读取 128 位数据（4 条指令）。
- **指令缓存 (I-Cache)**：64 行 128 位缓存。
- **数据缓存 (D-Cache)**：8 行 128 位缓存。

**启用建议**：在初始化系统时，务必开启加速器。

```c
FLASH->ACR |= FLASH_ACR_ICEN | FLASH_ACR_DCEN | FLASH_ACR_PRFTEN | FLASH_ACR_LATENCY_5WS;
```

## CCM RAM：被忽视的性能利器

**CCM (Core Coupled Memory)** 直接连接到 CPU 的 D-Bus，访问延迟极低，非常适合存放：

- 任务栈 (Stack)
- 频繁调用的全局变量
- 关键算法代码 (需从 Flash 拷贝至此运行)

**注意陷阱**：CCM RAM **不经过总线矩阵**，因此 **DMA 控制器无法直接访问 CCM RAM**。如果你将 DMA 缓冲区设置在 CCM 中，DMA 传输会直接失败。

## Flash 读写注意事项

### 1. 扇区结构 (Sector Layout)

STM32F407 的 Flash 扇区大小不均匀（非对齐）：

- **Sector 0-3**: 16 KB
- **Sector 4**: 64 KB
- **Sector 5-11**: 128 KB

这种设计导致在将 Flash 当作 EEPROM 使用时，如果需要擦除 Sector 11，必须一次性擦除 128KB 数据，极其耗时且影响寿命。

:::warning
如果有变量存储 CCM RAM ，在进行 Flash 擦除/写入时，必须禁用 ART 数据缓存才能正常写入，否则写入时会返回`FLASH_ERROR_PROGRAM`错误。因为 CCM RAM 和写 Flash 都是通过D-Bus进行访问，而开启数据缓存时，硬件会周期性访问 CCM RAM 进行缓存同步，导致写 Flash 时 D-Bus 总线占用，写入失败。
:::

### 2. 写入规则

- **先擦后写**：Flash 只能将位从 `1` 变为 `0`。写入前必须执行扇区擦除。
- **对齐要求**：F4 系列通常支持 byte (8-bit), half-word (16-bit), word (32-bit), double word (64-bit) 写入，取决于供电电压。

## 参考

1. [STM32F4xx Reference Manual (RM0090)](https://www.st.com.cn/resource/en/reference_manual/rm0090-stm32f405415-stm32f407417-stm32f427437-and-stm32f429439-advanced-armbased-32bit-mcus-stmicroelectronics.pdf)
2. [Cortex-M4 Memory Map Guide](https://developer.arm.com/documentation/dui0553/a/the-cortex-m4-processor/memory-model/memory-regions--types-and-attributes)
