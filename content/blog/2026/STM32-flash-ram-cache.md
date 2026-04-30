---
date: 2026-04-30
title: STM32 Flash 读写问题
description: 记录STM32F407进行Flash读写操作时遇到的问题
---

针对STM32F407内各种存储类型进行总结

## 地址空间

| 类型    | 地址 | 总线|
| ------- | ---- | ---- |
| Flash   | 1    | 2    |
| SRAM1    | 1    | 2    |
| SRAM2    | 1    | 2    |
| CCM RAM | 1    | 2    |

## 参考

1. [STM32F4xx数据手册](https://www.st.com.cn/resource/en/reference_manual/rm0090-stm32f405415-stm32f407417-stm32f427437-and-stm32f429439-advanced-armbased-32bit-mcus-stmicroelectronics.pdf)
