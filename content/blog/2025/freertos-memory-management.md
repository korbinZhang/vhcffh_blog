---
title: 'FreeRTOS 内存管理方案'
date: 2025-12-17
tags: ["FreeRTOS", "Memory"]
---

FreeRTOS 将内存管理与内核分离，通过统一的 `pvPortMalloc()` 和 `vPortFree()` 接口实现多种可选的堆管理算法（heap_1 ~ heap_5），以适配不同嵌入式场景。

**核心原则**：

- **动态分配**：运行时按需申请/释放内存，灵活但需控制碎片化与实时性。
- **静态分配**：编译期固定内存，可靠但利用率低。
- **线程安全**：FreeRTOS 内存 API 会在分配/释放时挂起调度器，避免并发冲突。

**五种内存管理实现**（位于 _Source/Portable/MemMang_，工程中只能选择一个）：

1. **heap_1** 仅支持分配，不支持释放，执行时间固定，无碎片。 适合启动时**一次性创建对象且不删除**的系统。
2. **heap_2** 支持释放，但不合并相邻空闲块，易产生碎片。 适合分配/释放**大小固定的对象**。
3. **heap_3** 封装 malloc/free，保证线程安全。 **依赖编译器堆设置**，非确定性，可能增大代码体积。
4. **heap_4** 最常用，支持释放并合并相邻空闲块，减少碎片。 适合**随机大小分配/释放**的应用。
5. **heap_5** 基于 heap_4，支持**多个不连续内存区域**（如片内 RAM + 外部 SDRAM）。 需先调用 `vPortDefineHeapRegions()` 初始化区域。

**典型使用示例**（heap_4）：

```c
#include "FreeRTOS.h"
#include "task.h"
#include <stdio.h>
void *ptr = NULL;
void mem_test(void) {
   size_t free_before = xPortGetFreeHeapSize();
   printf("申请前剩余内存: %u 字节\n", free_before);
   ptr = pvPortMalloc(1024);
   if (ptr) {
       printf("申请成功, 地址: %p\n", ptr);
       sprintf((char*)ptr, "Tick=%u", xTaskGetTickCount());
   }
   size_t free_after = xPortGetFreeHeapSize();
   printf("申请后剩余内存: %u 字节\n", free_after);
   vPortFree(ptr);
   printf("释放后剩余内存: %u 字节\n", xPortGetFreeHeapSize());
}
```

**要点**：

- 使用 `xPortGetFreeHeapSize()` 监控剩余堆空间。
- 对 heap_5，需先定义内存区域数组并调用 `vPortDefineHeapRegions()`。
- 对实时性要求高的系统，建议选用 **heap_1** 或静态分配，避免碎片化和不确定延迟。
