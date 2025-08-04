---
date: 2025-02-19
description: 本文介绍了FreeRTOS中用于多任务同步的几种锁机制。内容涵盖了用于保护共享资源的互斥锁（Mutexes），其特点是支持优先级继承以避免优先级反转。此外，还讲解了用于简单同步的二值信号量、控制资源数量的计数信号量以及用于复杂状态管理的事件组。
tags: ["FreeRTOS", "Lock", "Mutex"]
---

# FreeRTOS中的锁

在FreeRTOS中，锁(locks)主要用于在多任务环境中同步访问共享资源，防止多个任务同时访问资源引发冲突。
FreeRTOS提供了几种不同的锁机制，每种锁都有其特定的使用场景和作用。

## 互斥锁(Mutexes) 

互斥锁用于任务间的互斥访问，通常用来保护共享资源，确保同一时间只有一个任务能够访问资源，避免数据竞争。

在FreeRTOS中，互斥锁是二值信号量的一个扩展，但它增加了[优先级继承机制](https://www.cnblogs.com/mickey-double/p/14366803.html)，用于避免优先级反转(priority inversion)的问题。
通常用于保护共享资源（例如硬件设备、全局变量等）。

```c
#include "FreeRTOS.h"
#include "semphr.h"

SemaphoreHandle_t xMutex;

void vTask1(void *pvParameters) {
    while (1) {
        // 获取互斥锁
        if (xSemaphoreTake(xMutex, portMAX_DELAY) == pdTRUE) {
            // 访问共享资源
            printf("Task 1 is accessing shared resource\n");
            printf("Task 1 is run...\n");
            vTaskDelay(pdMS_TO_TICKS(500));
            printf("Task 1 is run end\n");
            // 释放互斥锁
            xSemaphoreGive(xMutex);
        }
    }
    vTaskDelete(NULL);
}

void vTask2(void *pvParameters) {
    while (1) {
        // 获取互斥锁
        if (xSemaphoreTake(xMutex, portMAX_DELAY) == pdTRUE) {
            // 访问共享资源
            printf("Task 2 is accessing shared resource\n");
            printf("Task 2 is run...\n");
            vTaskDelay(pdMS_TO_TICKS(500));
            printf("Task 2 is run end\n");
            // 释放互斥锁
            xSemaphoreGive(xMutex);
        }
    }
    vTaskDelete(NULL);
}

int main() {
    // 创建互斥锁
    xMutex = xSemaphoreCreateMutex();
    
    if (xMutex != NULL) {
        // 创建两个任务
        xTaskCreate(vTask1, "Task1", 1000, NULL, 1, NULL);
        xTaskCreate(vTask2, "Task2", 1000, NULL, 1, NULL);
        // 启动调度器
        vTaskStartScheduler();
    } else {
        // 创建互斥锁失败
        printf("Failed to create mutex\n");
    }
    
    return 0;
}
```

## 二值信号量(Binary Semaphores)

二值信号量(xSemaphoreCreateBinary,xSemaphoreTake,xSemaphoreGive)本质上是一种简单的锁机制，可以用来同步任务或中断与任务之间的通信，控制任务间的同步。
二值信号量只有两个状态：“已获取”或“未获取”。
但二值信号量**不支持优先级继承机制**，适用于比较简单的同步需求。

## 计数信号量(Counting Semaphores)

计数信号量可以用来控制多个任务访问共享资源的数量，通常用于限制资源的使用（例如限制同时可访问的设备数量）。
计数信号量可以有一个计数值，任务通过获取和释放信号量来减少或增加计数值。
通常用于控制对有限数量的资源（例如多个设备或缓冲区）的访问。

## 事件组(Event Groups)

事件组用于任务之间的复杂同步和状态管理。一个事件组由多个二进制标志位组成，任务可以等待这些标志位的变化。
事件组允许多个任务等待不同的标志位或者一个组合条件（例如：多个条件满足才继续执行）。
比较适用于需要多个任务同步或触发条件的场景。
通常用于任务间的复杂同步（例如多个任务的状态变化）。


