---
date: 2018-09-08
tags: ["Math", "Vector"]
description: 本文清晰地记录和解释了向量微积分中三个核心概念：梯度（Gradient）、旋度（Curl）和散度（Divergence）。文章分别给出了它们的数学定义和计算公式。梯度是指标量场在某点的变化率最大的方向和大小；旋度描述了向量场在某点附近的旋转程度；而散度则衡量了向量场在某点的源或汇的强度。文中使用了∇算子来形象地表示这三个概念，便于理解和记忆。
---

# 梯度旋度和散度



有关梯度旋度和散度的定义和计算,记录一下

## 1.定义
### 1.1梯度
设函数$ u=f(x,y,z) $在空间区域$ G $内具有一阶连续偏导数，其中点$ P(x,y,z) \in G $
则向量

```math
\left(
    \frac {\partial f}{\partial x},
    \frac {\partial f}{\partial y},
    \frac {\partial f}{\partial z}
\right)=
\frac {\partial f}{\partial x}\vec i+
\frac {\partial f}{\partial y}\vec j+
\frac {\partial f}{\partial z}\vec k
```

为函数$ u=f(x,y,z) $在点$ P(x,y,z) $的**梯度**

记为$ grad\;f(x,y,z) $ 或$ \nabla f(x,y,z) $ 

(<font color="red">注</font>: $ \nabla = \frac {\partial}{\partial x}\vec i+\frac {\partial}{\partial y}\vec j+\frac {\partial}{\partial z}\vec k $为三维的向量微分算子)

### 1.2旋度

在三维空间$ G $ 中有三维直角坐标系$ O_{xyz} $,设向量场:

```math
\vec v=v_x\vec i+v_y\vec j+v_z\vec k
```

其中$ v_x,v_y,v_z $具有一阶连续偏导数,点$ P(x,y,z) \in G $

向量

```math
  \begin{vmatrix}
  \vec i & \vec j & \vec k \cr
  \frac {\partial}{\partial x} & \frac {\partial}{\partial y} & \frac {\partial}{\partial z} \cr
  v_x & v_y & v_z \cr
  \end{vmatrix} = 
  (\frac {\partial v_z}{\partial y} - \frac {\partial v_y}{\partial z})\vec i+
  (\frac {\partial v_x}{\partial z} - \frac {\partial v_z}{\partial x})\vec j+
  (\frac {\partial v_y}{\partial x} - \frac {\partial v_x}{\partial y})\vec k
```

为向量场$ \vec v $ 在点$ P(x,y,z) $的**旋度**

记为$ curl\;v $或者$ \nabla \times v $

### 1.3散度

在三维空间$ G $ 中有三维直角坐标系$ O_{xyz} $,设向量场:

```math
\vec v=v_x\vec i+v_y\vec j+v_z\vec k
```

其中$ v_x,v_y,v_z $具有一阶连续偏导数,点$ P(x,y,z) \in G $

标量

```math
\frac {\partial v_x}{\partial x}+
\frac {\partial v_y}{\partial y}+
\frac {\partial v_z}{\partial z}
```

为向量场在点$ P(x,y,z) \in G $的散度

记为$div\;v$或$\nabla \cdot v$


