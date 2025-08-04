---
date: 2019-08-19
tags: ["Ensemble Learning", "Bagging", "Boosting"]
description: 本文总结了集成学习中的几种核心算法。内容主要介绍了Bagging（如随机森林）和Boosting（如AdaBoost）两大类方法的思想和区别。此外，还详细阐述了梯度提升（Gradient Boosting）算法的原理和步骤，并点明了随机森林、提升树和GBDT等模型分别是Bagging或Boosting与决策树结合的产物，为理解集成学习提供了清晰的框架。
---

# 集成学习算法总结




集成学习算法是指使用多个分类器提高整体的泛化能力

## 1.Bagging（Bootstrap Aggregating）算法

通过组合随机生成的训练集而改进分类的集成算法(bootstrap)

使用训练集中的某个子集作为当前训练集（有放回随机抽样）;经过T次训练后,得到T个不同的分类器

调用这T个分类器,把这T个分类结果中出现次数多的类赋予测试样例

有效减少噪声影响

## 2.Boosting算法

初始化样本权重,生成一个弱分类器;

利用弱分类器增加分类错误的样本的权重;

不断重复,生成T个弱分类器;

对噪声敏感

改进算法-AdaBoosting算法

-   对每一次的训练数据样本赋予一个权重，并且每一次样本的权重分布依赖上一次的分类结果
-   基分类器之间采用序列的线性加权方式来组合

## 3.Gradient Boosting

1,初始化

```math
f_0(x)=\arg\min_\gamma\sum_{i=1}^NL(y_i,\gamma)
```

2.1计算负梯度

```math
\widetilde y_i = -\frac{\partial L(y_i,f_{m-1}(x_i))}{\partial f_{m-1}(x_i)}, i=1,2,\cdots N
```

2.2用基学习器$ h_m(x) $ 拟合$ \widetilde y_i $

```math
w_m=\mathop{\arg\min}\limits_w\sum_{i=1}^N[\widetilde y_i-h_m(x_i;w)]^2
```

2.3确定步长$ \rho_m $

```math
\rho_m = \mathop{\arg\min}\limits_{\rho} \sum\limits_{i=1}^{N} L(y_i,f_{m-1}(x_i) + \rho h_m(x_i\,;\,w_m))
```

2.4更新$ f_m(x) $ 最终得到$ f_M(x) $

```math
f_m(x) = f_{m-1}(x) + \rho_m h_m(x\,;\,w_m)
```

Bagging + 决策树 = 随机森林

AdaBoost + 决策树 = 提升树

Gradient Boosting + 决策树 = GBDT
