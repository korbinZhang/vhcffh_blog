---
date: 2019-09-06
tags: ["Few-shot Learning", "GNN"]
---

# 小样本学习的边缘标签图神经网络



### Edge-Labeling Graph Neural Network for Few-shot Learning[[原文](https://arxiv.org/abs/1905.01436)]

小样本学习的边缘标签图神经网络

将样本映射到图中的节点,边表示节点之间的相似度,通过已知样本预测未知样本

#### Graph Neural Network

主要利用邻域聚合框架(通过对相邻节点特征的递归聚合和转换,计算出节点特征)进行表征学习

#### Edge-Labeling Graph

**Correlation clustering**

相关性聚类分析:一个通过同时最大化簇内相似性和簇间差异性来实现边标注推理的图分割算法

-   通过结构化向量机实现名词短语聚类和新闻文章聚类

#### Few-Shot Learning

C-way K-shot:一个meta-task,包括support
set随机抽取C个类别,每个类别K个样本(共CK个数据);和batch
set从这C各类别种抽取一批样本.

Mode Based, Metric Based,Optimization Based

#### Problem definition: Few-shot classification

-   在每个类只有很少样本的情况下学习一个分类器
-   每一个few-shot分类任务$ \mathcal T $包括support set $ \mathcal S $和query set $ \mathcal Q $
-   episodic training：在training task中抽样，模拟少样本测试时的场景
    -   $ \mathcal T = \mathcal S \cup \mathcal U $, 
        $ \mathcal S = {(x_i,y_i)}\_{i=1} ^{N \times K} $
        and $ \mathcal Q={(x_i,y_i)}\_{i=N \times K + 1}^{N \times K+T} $
    -   \$x_i,y\_i\\in{C\_1,...,C\_N}=\\mathcal C*{\\mathcal
        T}\\subset\\mathcal C\$同时\$\\mathcal C*{train}\\cap\\mathcal
        C*{test} = \\empty\$

#### Model

1.  通过卷积神经网络提取样本特征,$ \theta_{emb} $是卷积网络的参数
    
```math
\mathbf v_i^0=f_{emb}(x_i;\theta_{emb})
```

2.  图构建:$ \mathcal g=(\mathcal V,\mathcal E;\mathcal T) $每一个节点代表一个样本，全连接图，每一条边代表一种关系种类

    其中$ \mathcal V :={V_i}\_{i=1,\\dots,\|\\mathcal T\|}\$,\$\\mathcal
    E :={E*{ij}}*{i,j=1,\\dots,\|\\mathcal T\|}\$,

    1.  ground truth: edge-label

    2.  边特征\$\\mathbf e*{ij}={e*{ijd}}\^2\_{d=1} \\in
        \[0,1\]\^2\$是一个二维矩阵,表示两个之节点间的簇内关系和簇间关系的强弱,\|\|表示连接


3.  传播:设从\$\\ell -1 \$层得到的特征为 $ \mathbf v\*i^{\ell-1}\$
    和\$\\mathbf e*{ij}\^{\\ell-1}\$

    1.  更新节点特征

        其中$ \tilde e\_{ij1}^{\ell-1}=\frac {e\_{ijd}}{\sum_ke\_{ikd}}\$,\$f\_v\^\\ell(\\theta)\$是节点特征的转变网络(MLP).

    2.  更新边特征

        其中 \$f\_e\^\\ell\$是metric network计算节点相似度

4.  输出结果:节点属于某个集合的分布\$P(y\_i=\\mathcal C\_k\|\\mathcal
    T)=p\_i\^{(k)}\$

#### Training

其中模型参数有$ \theta*{emb}
\cup{\theta_v^\ell,\theta_e^\ell}\_{\ell=1}^L $,对于M个训练任务${ \mathcal T_m^{train}}\_{m=1}^M $,损失函数:

其中\$Y*{m,e}\$和\$\\hat
Y*{m,e}\^\\ell\$是m个任务,e条边的真实值和预测值(第\$\\mathcal
L\$层的),\$\\mathcal L\$是交叉熵损失函数
