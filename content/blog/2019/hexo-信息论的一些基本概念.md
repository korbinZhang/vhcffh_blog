---
date: 2019-08-18
tags: ["Information Theory", "Entropy"]
---

# 信息论的一些基本概念



**信息熵**

```math
H(X)=E[I(X)]=E[-ln(P(X))]
```

其中$ P $ 为$ X $的概率质量函数,$ E $为期望函数,而$ I(x) $是$ X $的信息量(又称自信息).

```math
H(X)=\sum_iP(x_i)I(x_i)=-\sum_iP(x_i)\log_bP(x_i)
```

```math
\begin{matrix}
b & S\cr
2 & bit\cr
e & nat\cr
10 & Hart
\end{matrix}
```

**条件熵(Conditional Entropy)**

特征$ x $ 固定为$ x_i $时:$ H(c|x_i) $

特征$ x$ 整体分布已知时:$ H(x|X) $

**信息增益(Information Gain)**

```math
IG(X) = H(c)-H(c|X)
```

**基尼系数(基尼不纯度Gini impurity)**

```math
Gini(D)=1-\sum_i^np_i^2
```

```math
Gini(D|A)=\sum_i^n\frac {D_i}{D}
```

**信息增益比率(Information Gain Ratio)与分裂信息(Split information)**

```math
GR(D|A)=\frac {IG(D|A)}{SI(D|A)}
```

```math
SI(D|A)=-\sum_i^n\frac {N_i}{N}\log_2\frac{N_i}{N}
```

**边界熵(boundary entropy)**

```math
BE(w_1w_2\cdots w_k) = -\sum_{w \in C}p(w\vert w_1w_2\cdots w_k)\log p(w\vert w_1w_2\cdots w_k)
```

$ w $是邻接于$ w_1w_2 \cdots w_k $ 的字符.

**边界多样性(Accessor veriety,AV)**

```math
AV(w_1w_2\cdots w_k)=\log RL_{av}(w_1w_2\cdots w_k)
```

$ RL_{av} $ 表示邻接于字符串$ w_1w_2 \cdots w_k $的不同字符个数.

