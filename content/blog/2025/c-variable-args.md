---
title: 'C语言可变参数应用'
date: 2025-12-24
---

`va_list`是 C 语言专门用来解决可变参数问题的工具，于 C99 标准引入， `va_list` 类型允许函数接受可变数量的参数，这在编写需要处理不定数量参数的函数时非常有用。`va_list` 类型是在 `stdarg.h` 头文件中定义的，它允许函数处理可变数量的参数。下面我们将详细介绍 `va_list` 的用法以及实际应用示例。

## va_list的用法

`va_list` 是一个指向参数列表的指针，它允许函数处理不定数量的参数。`va_list` 类型通常与 `va_start`、`va_arg` 和 `va_end`一起使用。

- `va_list`：初始化 `va_list`类型的变量，使其指向参数列表的起始位置。
- `va_arg`：获取参数列表中的下一个参数，并将指针移动到下一个参数。
- `va_end`：清理 `va_list` 类型的变量。

## 应用举例

### 计算总和

```cpp
#include <stdarg.h>
#include <stdio.h>

int sum(int count, ...)
{
    int     sum = 0;
    va_list ap;
    va_start(ap, count);
    while (count--) sum += va_arg(ap, int);
    va_end(ap);
    return sum;
}

int main()
{
    printf("sum(5,1,2,3,4,5):%d\n", sum(5, 1, 2, 3, 4, 5));
    printf("sum(3,10,20,30):%d\n", sum(3, 10, 20, 30));
}
```

在上面的例子中， `sum` 函数通过固定参数 `count` 指定后续可变参数的数量，使用 `va_start` 初始化参数列表，在循环中用 `va_arg` 依次按 `int` 类型取出每个参数并累加计算结果。类似可以用于计算最大值、最小值、平均数等。编译输出结果如下：

```bash
❯ gcc main.c && ./a.out
sum(5,1,2,3,4,5):15
sum(3,10,20,30):60
```

### 日志格式化

```cpp
void log_debug(char *format, ...)
{
    char    buf[100];
    va_list ap;
    va_start(ap, format);
    vsprintf(buf, format, ap);
    va_end(ap);

    extern void uart_write(char *buf, int len);
    uart_write(buf, strlen(buf));
}

int main()
{
    int number = 10;
    log_debug("%s %c %d %02X\n", "test", 'C', number, number);
}
```

上面的例子，配合 `vsprintf`，在单片机开发中，可以方便的进行日志输出打印。

## 参考

1. [标准库头文件 stdarg.h - cppreference.cn - C++参考手册](https://cppreference.cn/w/c/header/stdarg)
2. [有关 va_list 的一些笔记 | bachzart's Blog](https://bachzart.github.io/2025/08/26/%E6%9C%89%E5%85%B3-va-list-%E7%9A%84%E4%B8%80%E4%BA%9B%E7%AC%94%E8%AE%B0/)
