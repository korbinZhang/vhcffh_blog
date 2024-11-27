---
sidebar: false
outline: false
date: 2019-10-02
---

# 矩阵中的求导

## 标量对向量求导

```math
y = f(x_1,\cdots,x_i,\cdots,x_n)
```

```math
X = [x_1,\cdots,x_i,\cdots,x_n]
```

```math
\frac {\partial y}{\partial X} = [\frac {\partial f}{\partial x_1},\cdots,\frac {\partial f}{\partial x_i},\cdots,\frac {\partial f}{\partial x_n}]
```

## 向量对向量求导

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

这是一个 n 行 m 列的矩阵,有时也会写成 m 行 n 列,都是一样的,区别在于加不加转置
