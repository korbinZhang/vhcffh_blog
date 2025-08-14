---
title: C++ numeric 中的算法
date: 2025-08-14
tags: [C++, STL, numeric, C++17]
description: 对C++标准库numeric头文件中实现的算法进行总结，包括accumulate, reduce, inner_product, transform_reduce, partial_sum, inclusive_scan, exclusive_scan, adjacent_difference, iota, gcd, lcm
outline: true
---

C++ 标准库的 `<numeric>` 头文件是进行数值计算的宝库。它不仅仅包含几个简单的函数，而是提供了一整套强大、高效且灵活的算法，用于处理序列数据。这些算法能够帮助我们写出更简洁、更具表现力且性能更高的代码，尤其是在现代 C++ (C++17 及以后) 中，它们中的许多都支持并行执行。

本文将全面介绍 `<numeric>` 头文件中的核心算法，分为三大类：

1.  **累积与归约 (Reduction)**：将一个序列合并成单个值。
2.  **扫描与前缀和 (Scan)**：计算序列的中间累积结果。
3.  **数值生成与数学工具**：用于初始化序列和基础数学计算。

## 累积与归约 (Reduction)

这类算法的目标是将一个序列中的所有元素通过某个二元操作（如加法、乘法）合并成一个单一的值。

### `std::accumulate` (C++98)

这是最经典、最基础的累积算法。它严格按照从左到右的顺序进行计算。

- **功能**：计算一个序列 `[first, last)` 中所有元素的总和，从一个初始值 `init` 开始。
- **特点**：保证严格的顺序执行，可以通过自定义操作实现求积、字符串拼接等。

```cpp
#include <vector>
#include <numeric>
#include <string>
#include <iostream>

std::vector<int> nums = {1, 2, 3, 4, 5};

// 计算总和
int sum = std::accumulate(nums.begin(), nums.end(), 0); // 15

// 计算乘积
int product = std::accumulate(nums.begin(), nums.end(), 1, std::multiplies<int>()); // 120

// 拼接字符串
std::vector<std::string> words = {"Hello", " ", "World"};
std::string sentence = std::accumulate(words.begin(), words.end(), std::string("")); // "Hello World"
```

### `std::reduce` (C++17)

`std::reduce` 是 `std::accumulate` 的现代化、可并行化版本。

- **功能**：与 `accumulate` 类似，但**不保证计算顺序**。
- **核心区别**：
  1.  **并行性**：允许乱序执行，因此可以利用 `std::execution::par` 等执行策略进行并行计算，从而大幅提升性能。
  2.  **操作要求**：由于乱序执行，提供的二元操作**必须满足结合律和交换律**（如加法、乘法），否则结果未定义。
  3.  **默认初始值**：有一个不需要 `init` 参数的版本，它会使用元素类型的默认构造函数（例如 `int{}` 即 `0`）作为初始值。

```cpp
#include <vector>
#include <numeric>
#include <execution>

std::vector<long> big_vec(1'000'000, 1);

// 使用并行策略计算总和
long parallel_sum = std::reduce(std::execution::par, big_vec.begin(), big_vec.end(), 0L);
```

> **何时选择？**
>
> - 需要保证顺序（如减法），或在 C++17 之前的代码中，使用 `std::accumulate`。
> - 追求性能，且操作允许乱序（如加法），现代 C++ 代码首选 `std::reduce`。

### `std::inner_product` (C++98)

- **功能**：计算两个序列的内积（点积）。它将两个序列的对应元素相乘，然后将所有乘积累加起来。
- **灵活性**：可以自定义累积操作和元素配对操作。

```cpp
std::vector<int> v1 = {1, 2, 3};
std::vector<int> v2 = {4, 5, 6};

// 计算内积: (1*4 + 2*5 + 3*6)
int dot_product = std::inner_product(v1.begin(), v1.end(), v2.begin(), 0); // 32
```

### `std::transform_reduce` (C++17)

这是最强大的归约算法，完美体现了 "map-reduce" 思想。

- **功能**：
  1.  **单序列**：先对每个元素应用一个转换操作（map），然后再对结果进行归约（reduce）。
  2.  **双序列**：先对两个序列的对应元素应用一个二元操作（transform），然后再对结果进行归约（reduce）。
- **特点**：可并行化，且将转换和归约合二为一，避免了创建中间容器。

```cpp
std::vector<int> nums = {1, 2, 3, 4};

// 计算平方和 (1*1 + 2*2 + 3*3 + 4*4)
int sum_of_squares = std::transform_reduce(
    nums.begin(), nums.end(),
    0,                                 // 初始值
    std::plus<>(),                     // Reduce 操作: 相加
    [](int x) { return x * x; }        // Transform 操作: 平方
); // 30
```

## 扫描与前缀和 (Scan)

扫描算法不会将序列归约为单个值，而是生成一个包含所有中间累积结果的新序列。

### `std::partial_sum` (C++98)

- **功能**：计算序列的“部分和”，即 `inclusive_scan` 的早期版本。结果中的第 `i` 个元素是原序列前 `i+1` 个元素的和。

```cpp
std::vector<int> data = {1, 2, 3, 4, 5};
std::vector<int> result(5);

std::partial_sum(data.begin(), data.end(), result.begin());
// result: {1, 3, 6, 10, 15}
```

### `std::inclusive_scan` & `std::exclusive_scan` (C++17)

这两个是现代化的、可并行的扫描算法。

- **`inclusive_scan`**：包含当前元素的扫描，行为与 `partial_sum` 相同。
- **`exclusive_scan`**：不包含当前元素的扫描，结果中的第 `i` 个元素是原序列前 `i` 个元素的和。

```cpp
std::vector<int> data = {1, 2, 3, 4, 5};
std::vector<int> incl_res(5), excl_res(5);

// 包含当前项的前缀和
std::inclusive_scan(data.begin(), data.end(), incl_res.begin());
// incl_res: {1, 3, 6, 10, 15}

// 不包含当前项的前缀和
std::exclusive_scan(data.begin(), data.end(), excl_res.begin(), 0);
// excl_res: {0, 1, 3, 6, 10}
```

### `std::adjacent_difference` (C++98)

- **功能**：可以看作是 `partial_sum` 的逆运算，计算序列中每两个相邻元素之间的差。

```cpp
std::vector<int> data = {1, 3, 6, 10, 15};
std::vector<int> result(5);

std::adjacent_difference(data.begin(), data.end(), result.begin());
// result: {1, 2, 3, 4, 5} (恢复了原始序列)
```

## 数值生成与数学工具

### `std::iota` (C++11)

- **功能**：用一个从指定值开始连续递增的序列来填充一个范围。非常适合快速初始化。

```cpp
std::vector<int> nums(5);
std::iota(nums.begin(), nums.end(), 10); // 填充 10, 11, 12, 13, 14
```

### `std::gcd` & `std::lcm` (C++17)

- **功能**：计算两个整数的最大公约数（Greatest Common Divisor）和最小公倍数（Least Common Multiple）。

```cpp
int a = 12, b = 18;
int common_divisor = std::gcd(a, b);   // 6
int common_multiple = std::lcm(a, b); // 36
```

## 总结

`<numeric>` 头文件为 C++ 开发者提供了一套声明式、高效且功能强大的工具。通过使用这些算法，我们可以：

- **提高代码可读性**：算法的名称（如 `accumulate`, `transform_reduce`）清晰地表达了代码的意图。
- **提升代码性能**：C++17 引入的并行版本算法可以充分利用现代多核 CPU 的计算能力。
- **减少错误**：标准库算法经过了充分的测试和优化，比手写的循环更可靠。

下次当你需要对一个序列进行数值计算时，不妨先查阅一下 `<numeric>` 头文件，很可能已经有一个完美的算法在等着你了。

## 参考

1. https://cppreference.cn/w/cpp/numeric
2. https://cplusplus.com/reference/numeric/
