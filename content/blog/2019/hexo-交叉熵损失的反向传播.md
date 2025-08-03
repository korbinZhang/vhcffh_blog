---
date: 2019-10-02
tags: ["Cross Entropy", "Backpropagation", "Deep Learning"]
---

# 交叉熵损失的反向传播




对于一个单标签多分类问题,假设网络的输出层的输入为$Z_{in}=[z_1,\cdots,z_i,\cdots,z_n]$,
输出为\$\\hat Y=\[\\hat y\_1,\\cdots,\\hat y\_i,\\cdots,\\hat y\_n\]\$,
真实类标签为\$Y = \[y\_1,\\cdots,y\_i,\\cdots,y\_n\]\$,\$n\$为类别数(输出层神经元数),通常有:

```math
\hat Y = Softmax(Z_{in})\tag{1}
```

```math
\hat y_i = \frac {e^{z_i}}{\sum_{j=0}^n e^{z_j}}\tag{2}
```

其中\$Softmax\$为:

```math
Softmax(Z_{in}) = [\cdots,\frac {e^{z_i}}{\sum_{j=1}^n e^{z_j}},\cdots]\tag{3}
```

## 交叉熵损失

```math
Loss(Y,\hat Y) = -\sum_{i=1}^ny_i*\ln(\hat y_i)\tag{4}
```

损失对神经网络输出的偏导([标量对向量求偏导](https://www.vhcffh.com/2019/矩阵中的求导/))为:

```math
\frac {\partial Loss(Y,\hat Y)}{\partial \hat Y} = [-\frac {y_1}{\hat y_1},\cdots,-\frac {y_i}{\hat y_i},\cdots,-\frac {y_n}{\hat y_n}]\label{5}\tag{5}
```

后向传播推导中遇到的所有量都是变量,最终的目的是找到损失关于某变量的偏导,程序中也只用这个公式求得对应输入点的梯度

## Softmax的偏导

求\$\\hat y\_i​\$对\$z\_i​\$的偏导,根据{2}可得:

求\$\\hat Y\$对\$Z\$的偏导([向量对向量求导](https://blog.vhcffh.com/hexo-ju-zhen-zhong-de-qiu-dao/))

这里把\$y\$的坐标写作\$k\$

\$k=i\$时:

```math
\begin{split}
\frac {\partial \hat y_i}{\partial z_i}
&= e^{z_i} * \frac {1}{\sum_{j=1}^ne^{z_j}} +
   e^{z_i} * (-\frac {1}{(\sum_{j=1}^n e^{z_j})^2}) * e^{z_i} \cr
&= \frac {e^{z_i}}{\sum_{j=1}^n e^{z_j}} - (\frac {e^{z_i}}{\sum_{j=1}^n e^{z_j}})^2 \cr
&= \hat y_i - \hat y_i^2
\end{split}
\tag{6}
```

\$k \\neq i\$时:

```math
\begin{split}
\frac {\partial \hat y_k}{\partial z_i}
&= e^{z_k} * (-\frac {1}{(\sum_{j=1}^n e^{z_j})^2}) * e^{z_i} \cr
&= -\frac {e^{z_k}*e^{z_i}}{(\sum_{j=1}^n e^{z_j})^2} \cr
&= - \hat y_k\hat y_i
\end{split}
\tag{7}
```

写成矩阵:

```math
\frac {\partial \hat Y}{\partial Z_{in}} = 
\begin{bmatrix}
\hat y_1-\hat y_1^2 & -\hat y_2\hat y_1 & \cdots & -\hat y_n\hat y_1\cr
-\hat y_1\hat y_2 & \hat y_2-\hat y_2^2 & \cdots & -\hat y_n\hat y_2\cr
\vdots & \vdots & \ddots & \vdots\cr
-\hat y_1\hat y_n & -\hat y_2\hat y_n & \cdots & \hat y_n-\hat y_n^2\cr
\end{bmatrix}\tag{8}
```
这是一个对称矩阵,在链式求导时加不加转置都一样

根据(5)和(8),损失\$L\$对输入\$Z\$的偏导([标量对向量求偏导](https://blog.vhcffh.com/hexo-ju-zhen-zhong-de-qiu-dao/)):

```math
\begin{align}
\frac {\partial L(Y,\hat Y)}{\partial Z}
&= \frac {\partial L(Y,\hat Y)}{\partial \hat Y} (\frac {\partial \hat Y}{\partial Z})^T\cr
&= [-\frac {y_1}{\hat y_1},\cdots,-\frac {y_i}{\hat y_i},\cdots,-\frac {y_n}{\hat y_n}]
\begin{bmatrix}
\hat y_1-\hat y_1^2 & -\hat y_2\hat y_1 & \cdots & -\hat y_n\hat y_1\cr
-\hat y_1\hat y_2 & \hat y_2-\hat y_2^2 & \cdots & -\hat y_n\hat y_2\cr
\vdots & \vdots & \ddots & \vdots\cr
-\hat y_1\hat y_n & -\hat y_2\hat y_n & \cdots & \hat y_n-\hat y_n^2\cr
\end{bmatrix}^T\cr
&= [(\hat y_1-1)y_1+\hat y_1y_2+\cdots+\hat y_1y_n,\hat y_2y_1+(\hat y_2-1)y_2+\cdots+\hat y_1y_n,\cdots]\cr
&= [\hat y_1\sum_{i=1}^ny_i-y_1,\cdots,\hat y_j\sum_{i=1}^ny_i-y_j,\cdots,\hat y_n\sum_{i=1}^ny_i-y_n]\cr
&= [\hat y_1-y_1,\cdots,\hat y_j-y_j,\cdots,\hat y_n-y_n]\ \ \ \ (\sum_{i=1}^ny_i=1)\cr
&= \hat Y-Y
\end{align}
```
