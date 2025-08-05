---
title: 'C++位操作'
date: 2025-08-04
tags: [C++, Bit Manipulation, C++14, C++20, Programming]
outline: true
---

位操作是程序员的“超能力”之一。它允许我们深入到数据的最底层，直接操控二进制位，从而实现高效的算法、紧凑的数据存储和底层的硬件交互。C++ 语言提供了一套丰富且不断进化的工具集来支持位操作，从经典的位运算符到 C++20 引入的高性能函数，应有尽有。

本文将系统性地介绍 C++ 中所有与位操作相关的函数和工具，分为四个类别，并提供清晰的示例，帮助你彻底掌握它们。

## 基础核心：位运算符

这是所有位操作的基石。它们是 C++ 内置的运算符，直接对整数类型进行操作。

| 运算符 | 名称           | 描述                                                                                       |
| :----- | :------------- | :----------------------------------------------------------------------------------------- |
| `&`    | 按位与 (AND)   | 两个操作数对应位都为 1 时，结果位才为 1。                                                  |
| `\|`   | 按位或 (OR)    | 两个操作数对应位只要有 1 个为 1，结果位就为 1。                                            |
| `^`    | 按位异或 (XOR) | 两个操作数对应位不同时，结果位为 1，相同时为 0。                                           |
| `~`    | 按位取反 (NOT) | 翻转操作数的每一位（0 变 1，1 变 0）。                                                     |
| `<<`   | 左移           | 将操作数的所有位向左移动指定的位数，右侧补 0。                                             |
| `>>`   | 右移           | 将操作数的所有位向右移动指定的位数，左侧补位（对于无符号数补 0，对于有符号数取决于实现）。 |

**示例**

```cpp
#include <iostream>
#include <bitset> // 用于二进制可视化
#include <iomanip>

int main() {
    unsigned char a = 0b01010101; // 85
    unsigned char b = 0b11110000; // 240

    std::cout << "a = " << std::bitset<8>(a) << std::endl; // 输出: a = 01010101
    std::cout << "b = " << std::bitset<8>(b) << std::endl; // 输出: b = 11110000
    std::cout << "-------------------------" << std::endl;
    std::cout << "a & b = " << std::bitset<8>(a & b) << std::endl; // 输出: a & b = 01010000
    std::cout << "a | b = " << std::bitset<8>(a | b) << std::endl; // 输出: a | b = 11110101
    std::cout << "a ^ b = " << std::bitset<8>(a ^ b) << std::endl; // 输出: a ^ b = 10100101
    std::cout << "~a    = " << std::bitset<8>(~a) << std::endl;    // 输出: ~a    = 10101010
    std::cout << "a << 2= " << std::bitset<8>(a << 2) << std::endl; // 输出: a << 2= 01010100
    std::cout << "b >> 2= " << std::bitset<8>(b >> 2) << std::endl; // 输出: b >> 2= 00111100
}
```

## 函数式编程的优雅：`<functional>` (C++14)

为了让位运算能与 STL 算法（如 `std::accumulate`）无缝协作，C++14 在 `<functional>` 头文件中引入了一组函数对象。

- `std::bit_and<T>`: 执行按位与 (`&`)。
- `std::bit_or<T>`: 执行按位或 (`|`)。
- `std::bit_xor<T>`: 执行按位异或 (`^`)。
- `std::bit_not<T>`: 执行按位取反 (`~`)。

它们的主要优势在于作为“可调用对象”传递，使代码更具表现力。

**示例：计算向量中所有元素的异或和**

```cpp
#include <iostream>
#include <vector>
#include <numeric>    // For std::accumulate
#include <functional> // For std::bit_xor

int main() {
    std::vector<int> nums = {1, 2, 3, 4, 5}; // 01, 10, 11, 100, 101

    // 计算 ((((0^1)^2)^3)^4)^5
    int xor_sum = std::accumulate(
        nums.begin(),
        nums.end(),
        0,                  // 初始值
        std::bit_xor<int>() // 操作函数
    );

    std::cout << "XOR sum of the vector is: " << xor_sum << std::endl; // 输出: XOR sum of the vector is: 1
}
```

## 现代 C++的高性能工具箱：`<bit>` (C++20)

C++20 带来了革命性的 `<bit>` 头文件，提供了一组高效的底层位操作函数，它们通常能直接映射到现代 CPU 的硬件指令，性能极高。

- `std::popcount(n)`: 计算 `n` 中值为 1 的位的数量（"population count"）。
- `std::has_single_bit(n)`: 检查 `n` 是否是 2 的幂（即是否只有一个位是 1）。
- `std::countl_zero(n)` / `std::countr_zero(n)`: 分别计算从左（高位）或从右（低位）开始的连续 0 的数量。
- `std::bit_ceil(n)` / `std::bit_floor(n)`: 分别计算大于等于 `n` の最小的 2 的幂和小于等于 `n` 的最大的 2 的幂。
- `std::rotl(n, s)` / `std::rotr(n, s)`: 将 `n` 循环左移或右移 `s` 位。

**示例**

```cpp
#include <iostream>
#include <bit> // 需要 C++20
#include <bitset>

int main() {
    unsigned int num = 42; // 二进制: ...00101010

    std::cout << "Number: " << num << std::endl; // 输出: Number: 42
    std::cout << "Popcount (number of set bits): " << std::popcount(num) << std::endl; // 输出: Popcount (number of set bits): 3
    std::cout << "Is power of two? " << std::boolalpha << std::has_single_bit(num) << std::endl; // 输出: Is power of two? false
    std::cout << "Ceiling to power of two: " << std::bit_ceil(num) << std::endl; // 输出: Ceiling to power of two: 64
    std::cout << "Floor to power of two: " << std::bit_floor(num) << std::endl; // 输出: Floor to power of two: 32

    // 对于一个 8 位数
    unsigned char byte = 0b00110100; // 52
    std::cout << "\nByte: " << std::bitset<8>(byte) << std::endl; // 输出: Byte: 00110100
    std::cout << "Count leading zeros: " << std::countl_zero(byte) << std::endl; // 输出: Count leading zeros: 2
    std::cout << "Count trailing zeros: " << std::countr_zero(byte) << std::endl; // 输出: Count trailing zeros: 2
    std::cout << "Rotate left by 2: " << std::bitset<8>(std::rotl(byte, 2)) << std::endl; // 输出: Rotate left by 2: 11010000
}
```

## 面向对象的位容器：`<bitset>`

`std::bitset` 是一个类模板，用于管理一个固定大小的位序列。它像一个 `bool` 数组，但为位操作进行了空间和性能优化，并提供了丰富的成员函数。

- **构造**: 可以从整数、字符串等创建。
- **访问与修改**: `[]`, `set()`, `reset()`, `flip()`。
- **查询**: `count()`, `size()`, `any()`, `none()`, `all()`。
- **转换**: `to_string()`, `to_ulong()`, `to_ullong()`。

**示例**

```cpp
#include <iostream>
#include <bitset>
#include <string>

int main() {
    // 创建一个 8 位的 bitset
    std::bitset<8> flags("01010011");

    std::cout << "Initial flags: " << flags << std::endl; // 输出: Initial flags: 01010011
    std::cout << "Number of active flags: " << flags.count() << std::endl; // 输出: Number of active flags: 4

    // 检查特定标志位
    if (flags[2]) { // 第 2 位 (从右到左)
        std::cout << "Flag 2 is active." << std::endl; // 输出: Flag 2 is active.
    }

    // 修改标志位
    flags.flip(7); // 翻转最高位
    flags.set(0);  // 激活最低位
    std::cout << "Modified flags: " << flags << std::endl; // 输出: Modified flags: 11010011

    // 转换为整数
    std::cout << "Integer value: " << flags.to_ulong() << std::endl; // 输出: Integer value: 211
}
```

## 总结

| 功能 (Feature)     | 来源 (Source)  | 核心用途                             | C++ 版本 |
| :----------------- | :------------- | :----------------------------------- | :------- |
| **位运算符**       | C++ 语言内置   | 基础、直接的位运算                   | C++98    |
| **位运算函数对象** | `<functional>` | 与 STL 算法结合，实现函数式风格      | C++14    |
| **高性能位函数**   | `<bit>`        | 高性能、访问底层 CPU 指令            | C++20    |
| **位序列容器**     | `<bitset>`     | 管理固定大小的位集合，如标志位、掩码 | C++98    |

**如何选择？**

- **日常简单操作**: 直接使用**位运算符** (`&`, `|`, `^` 等)。
- **需要与 STL 算法集成**: 使用 `<functional>` 中的**函数对象**。
- **追求极致性能或需要高级位操作** (如 `popcount`, 循环移位): 优先使用 C++20 的 `<bit>` 库。
- **需要管理一组状态标志或构建位掩码**: `std::bitset` 是最清晰、最安全的选择。

通过掌握这些工具，你可以在 C++ 中编写出更高效、更优雅、更底层的代码。希望这篇指南能成为你探索位操作世界的得力助手!
