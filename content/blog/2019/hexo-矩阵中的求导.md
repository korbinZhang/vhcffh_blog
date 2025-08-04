---
date: 2019-10-02
tags: ["Matrix", "Calculus"]
description: 本文简要介绍了矩阵微积分中的两种基本求导运算。第一种是标量对向量求导，其结果是一个行向量，包含了该标量对向量中每个元素求偏导数的值。第二种是向量对向量求导，其结果是一个雅可比（Jacobian）矩阵，矩阵的每一列是输出向量中的一个分量对输入向量求导的结果。文章明确了求导结果的维度和布局约定。
---

# 矩阵中的求导



### 标量对向量求导

```math
y = f(x_1,\cdots,x_i,\cdots,x_n)
```

```math
X = [x_1,\cdots,x_i,\cdots,x_n]
```

```math
\frac {\partial y}{\partial X} = [\frac {\partial f}{\partial x_1},\cdots,\frac {\partial f}{\partial x_i},\cdots,\frac {\partial f}{\partial x_n}]
```

### 向量对向量求导

```math
Y = [f_1(x_1,\cdots,x_i,\cdots,x_n),\cdots,
f_i(x_1,\cdots,x_i,\cdots,x_n),\cdots,
f_m(x_1,\cdots,x_i,\cdots,x_n)]
```

```math
X = [x_1,\cdots,x_i,\cdots,x_n]
```

```math
\frac {\partial Y}{\partial X} = 
\begin{bmatrix}
\frac {\partial f_1}{\partial x_1} & \frac {\partial f_2}{\partial x_1} & \cdots & \frac {\partial f_m}{\partial x_1}\cr
\frac {\partial f_1}{\partial x_2} & \frac {\partial f_2}{\partial x_2} & \cdots & \frac {\partial f_m}{\partial x_1}\cr
\vdots & \vdots & \ddots & \vdots\cr
\frac {\partial f_1}{\partial x_n} & \cdots & \cdots & \frac {\partial f_m}{\partial x_n}\cr
\end{bmatrix}
```

这是一个n行m列的矩阵,有时也会写成m行n列,都是一样的,区别在于加不加转置
