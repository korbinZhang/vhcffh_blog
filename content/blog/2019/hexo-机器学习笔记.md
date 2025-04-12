---
date: 2019-11-15
---

# 机器学习笔记



分类
---------------------------------

准确率:所有样本中预测正确的占比

```math
accuracy =\frac {TP+TN}{TP+TN+FP+FN} = \frac {T}{T+F}
```

精确率:**预测为正的样本**中真正的正样本占比

```math
precision = \frac {TP}{TP+FP} = \frac {TP}{P'}
```

召回率:**正样本**中预测为正的占比

```math
recall = \frac{TP}{TP+FN} = \frac{TP}{P}
```

F1:精确率和召回率的**调和均值**

```math
\begin{align*}
\frac{2}{F_1} & = \frac{1}{precision} + \frac{1}{recall}\cr
F_1 & = \frac{2\cdot precision \cdot recall}{precision+recall}\cr
F_1 & = \frac{2TP}{2TP + FP + FN} \cr
F_1 & = \frac{2TP}{P' + P} \cr
\end{align*}
```

F-score:

```math
F_{score}=(1+\beta^2)\cdot \frac{precision \cdot recall}{\beta^2\cdot precision + recall}
```

|     |  P  |  N  |
| --- | --- | --- |
| P'  | TP  | FP  |
| N'  | FN  | TN  |

序列
---------------------------------

BLEU(Bilingual Evaluation understudy)

```math
CP_n(C,S)=\frac {\sum_i\sum_k\min(h_k(c_i),max_{j \in m}h_k(s_{ij}))}{\sum_i\sum_kh_k(c_j)}
```

**惩罚因子BP(Brevity Penalty)**

```math
b(C,S)=\begin{cases}
1,                        &l_c \lt l_s \cr
e^{1-\frac{l_s}{l_c}},    &l_c \geq l_s
\end{cases}
```

```math
BLEU_N(C,S)=b(C,S)\exp(\sum_{n=1}^N\omega_n\log CP_n(C,S))
```

机器翻译

ROUGE(Recall-Oriented Understudy for Gisting Evaluation)

|   ROUGE-N  |基于N-gram公现性统计|
|  --------- |------------------------------------------------------|
|   ROUGE-L  |基于最长公有子句共现性精确度和召回率Fmeasure统计|
|   ROUGE-W  |代权重的最长公有子句共现性精确度和召回率Fmeasure统计|
|   ROUGE-S  |不连续二元组共现性精确度和召回率Fmeasure统计|

**ROUGE-N**

```math
ROUGE-N=\frac {\sum_{S \in ReferencesSummaries}\sum_{gram_n\in S}Count_{match}(gram_n)}
{\sum_{S \in ReferencesSummaries}\sum_{gram_n\in S}Count(gram_n)}
```

**ROUGE-L**
最长公共子句longest common subsequence(LCS)

```math
R_{lcs}=\frac {LCS(X,Y)}{m} ,m=len(X)
```

```math
P_{lcs}=\frac {LCS(X,Y)}{n} ,n=len(Y)
```

```math
F_{lcs}=\frac{(1+\beta^2)R_{lcs}P_{lcs}}{R_{lcs}+\beta^2P_{lcs}}
```

