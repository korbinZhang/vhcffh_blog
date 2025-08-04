---
date: 2019-09-07
tags: ["Neural Turing Machine", "Deep Learning"]
description: 本文解读了神经图灵机（Neural Turing Machine, NTM）的核心机制。NTM通过一个外部记忆矩阵增强了神经网络的能力。文章详细介绍了其读、写操作过程，关键在于一个可微的定位向量（addressing vector）。该向量的生成结合了基于内容的寻址（通过余弦相似度）和基于位置的寻址（通过插值、循环卷积偏移和重塑），使得模型能够端到端地学习访问和修改记忆。
---

# 神经图灵机



### Neural Turing Machines[原文](https://arxiv.org/abs/1410.5401)

-   读记忆(Read Heads)

    把时刻$t$的记忆看作是一个$ N \times M $的矩阵$ M_t $,读的过成首先生成长度为$N$的定位权重向量$w_t$,表示$N$个记忆位置的权值大小,读出的记忆向量为$r_t$:

```math
r_t=\sum_i^Nw_t(i)M_t(i) \ \ \ \sum_iw_t(i)=1
```

对\$N\$条记忆进行加权求和

-   写记忆(Write Heads)

    类似LSTM:擦除向量\$e\_t\$,增加向量\$a\_t\$

    -   擦除操作:

    ```math
    M_t'(i)=M_{t-1}(1-w_t(i)e_t(i))
    ```

    -   增加操作:
    
    ```math
    M_t(i)=M_t'(i)+w_t(i)a_t(i)
    ```

    神经图灵机的关键是定位向量\$w\_t\$,其它的是由控制器(LSTM,MLP)输出

-   定位机制(Addressing Mechanism)

    结合了基于内容和基于位置的两种方法

    -   基于内容(Content-based Addressing)

        ```math
        w_t^c(i)=\frac {\exp(\beta_tK[k_t,M_t(i)])}{\sum_j\exp(\beta_tK[k_t,M_t(j)])}
        ```

        \$K\[...\]\$是余弦相似度计算:

        ```math
        K[u,v]=\frac{u \cdot v}{\Vert u\Vert \cdot \Vert v\Vert}
        ```

        \$\\beta\_t\$是控制器输出

    -   基于位置(Location-based Addressing)

        -   插值(Interpolation)
            ```math
            w_t^g=g_tw_t^c+(1-g_t)w_{t-1}
            ```

            \$g\_t\$有控制器生成

        -   偏移(shift)
            ```math
            \tilde w_t(i)=\sum_{j=0}^{N-1}w_t^g(j)s_t(i-j)
            ```

            每一个\$\\tilde w\_t(i)\$都与相邻元素有关

        -   重塑(Sharping)
        ```math
        w_t(i)=\frac{\tilde w_t(i)^{\gamma_t}}{\sum_j\tilde w_t(j)^{\gamma_t}}
        ```
