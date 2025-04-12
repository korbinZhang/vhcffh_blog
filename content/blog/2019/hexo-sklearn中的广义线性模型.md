---
date: 2019-08-20
---

# sklearn中的广义线性模型



模型的通用公式

```math
\hat y(w,x)=w_0+w_1x_1+\dots+w_px_p
```

普通最小二乘法

```math
w=\min_w{\Vert Xw-y\Vert_2}^2
```

LinearRegression

岭回归

```math
w=\min_w{\Vert Xw-y\Vert_2}^2+\alpha {\Vert w \Vert_2}^2
```

$ \alpha $ 是控制系数收缩量的复杂性参数: $ \alpha $ 的值越大，收缩量越大，模型对共线性的鲁棒性也更强。

共线性:线性回归模型中的解释变量之间由于存在精确相关关系或高度相关关系而使模型估计失真

Ridge,RigdeCV:广义交叉验证(GCV),默认留一验证(LOO-CV)

Lasso

```math
w = \min_w\frac{1}{2n_{samples}}\Vert Xw-y \Vert_2^2 + \alpha \Vert w \Vert_1
```

$ \alpha $ 是常数,$ \Vert w \Vert \dot 1 $ 是参数向量的$ l \dot {1-norm} $范数

Lasso,lasso\_path:通过搜索所有可能的路径上的值来计算系数

LassoCV,LassoLarsCV,LassoLarsIC

多任务Lasso

```math
w = \min_w\frac{1}{2n_{samples}}\Vert XW-Y\Vert_{Fro}^2+\alpha\Vert W \Vert_{21}
```

```math
\Vert A \Vert_{Fro}=\sqrt{\sum_{ij}a_{ij}^2}
```

```math
\Vert A \Vert_{21}= \sum_i\sqrt{\sum_j a_{ij}^2}
```

MultiTaskLasso

弹性网络

```math
w = \min_w\frac{1}{2n_{samples}}\Vert Xw-Y\Vert_2^2+\alpha\rho\Vert w \Vert_{1}+\frac{\alpha(1-\rho)}{2}\Vert w\Vert_2^2
```


ElasticNetCV通过交叉验证来设置参数`alpha`($ \alpha $)和`l1_rati0`($ \rho $)

多任务弹性网络

```math
W = \min_W\frac{1}{2n_{samples}}\Vert XW-Y\Vert_{Fro}^2+\alpha\rho\Vert W \Vert_{21}+\frac{\alpha(1-\rho)}{2}\Vert w\Vert_{Fro}^2
```

MultiTaskElasticNet
