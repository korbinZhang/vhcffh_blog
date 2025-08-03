---
date: 2019-07-21
tags: ["Loss Function", "Machine Learning"]
---

# 常见损失函数



1.损失函数

> **损失函数**是指一种将一个事件（在一个[样本](https://wiki.mbalib.com/wiki/%E6%A0%B7%E6%9C%AC)空间中的一个元素）映射到一个表达与其事件[相关](https://wiki.mbalib.com/wiki/%E7%9B%B8%E5%85%B3)的[经济成本](https://wiki.mbalib.com/wiki/%E7%BB%8F%E6%B5%8E%E6%88%90%E6%9C%AC)或[机会成本](https://wiki.mbalib.com/wiki/%E6%9C%BA%E4%BC%9A%E6%88%90%E6%9C%AC)的实数上的一种函数,较常运用在[统计学](https://wiki.mbalib.com/wiki/%E7%BB%9F%E8%AE%A1%E5%AD%A6)，[统计决策理论](https://wiki.mbalib.com/wiki/%E7%BB%9F%E8%AE%A1%E5%86%B3%E7%AD%96%E7%90%86%E8%AE%BA)和[经济学](https://wiki.mbalib.com/wiki/%E7%BB%8F%E6%B5%8E%E5%AD%A6)中。损失函数参数的真值为（θ），[决策](https://wiki.mbalib.com/wiki/%E5%86%B3%E7%AD%96)的结果为*d*
> ，两者的不一致会带来一定的损失，这种损失是一个[随机变量](https://wiki.mbalib.com/wiki/%E9%9A%8F%E6%9C%BA%E5%8F%98%E9%87%8F)，用*L*(θ,*d*)表示。

1.1 0-1损失函数(0-1 loss function)

```math
L(Y,f(X))=
\begin{cases}
1,Y \neq f(X)\cr
0,Y = f(X)
\end{cases}
```

1.2平方损失函数(quadratic loss function)

```math
L(Y,f(X))=(Y-f(X))^2
```

1.3绝对损失函数(absolute loss function)

```math
L(Y,f(X))=|Y-f(X)|
```

1.4对数损失函数(logarithmic loss function)或对数似然损失函数(log likelihood loss function)

```math
L(Y,P(Y|X))=-logP(Y|X)
```

2.风险函数
**风险函数**是损失函数的期望值，表示为：

```math
R(\theta,d)=E[L(d,\theta)]
```

决策的目标是要找出一个决策方案$d$，使其对各个自然状态风险值均为最小。应用时，常常对θ(参数的真值)确定一个概率分布，并使其平均的风险值$r(d,\theta)$达到最小，其中：
```math
r(d,\theta) = E[R(d,\theta)]=\sum_{j=1}^LR(d,\theta)p(\theta_j)
```
有结构风险函数和经验风险函数

参考资料

1,<http://www.csuldw.com/2016/03/26/2016-03-26-loss-function/>
