+++
title = "pytorch使用和损失函数"
date = 2019-07-26

[taxonomies]
categories = ["编程"]
tags = ["神经网络", "损失函数"]

[extra]
math = true
math_auto_render = true
+++

# 激励函数

```python
#激活函数
x=np.arange(-12.5,12.5,0.05)
tanh = (np.power(np.e,x)-np.power(np.e,-x))/(np.power(np.e,x)+np.power(np.e,-x))
relu = np.maximum(0.0,x)
sigmoid = 1.0/(1.0+np.power(np.e,-x))

torch.nn.Sigmoid()

torch.nn.Tanh()
```

BatchNorm2d

对每一个特征进行正则

pytorch中的正则化函数

```python
torch.nn.functional.normalize(input, p=2, dim=1, eps=1e-12, out=None)

torch.norm(input, p='fro', dim=None, keepdim=False, out=None, dtype=None)
# 对维度dim求p范数

torch.Tensor.squeeze()->Tensor#维度压缩
torch.cat(tensors, dim=0, out=None)->Tensor #维度拼接
torch.stack(tensors,dim=0,out=None)->Tensor #张量拼接
# cat是把多张纸拼成一张纸,stack是把纸摞起来
torch.Tensor.repeat()->Tensor #矩阵扩展
torch.Tensor.transpose()->Tensor #矩阵转置
torch.eq() #张量比较
torch.chunk() #张量分块
torch.split(tensor, split_size_or_sections, dim=0) #张量分块
```

# 损失函数

L1Loss
```python
torch.nn.L1Loss(size_average=None, reduce=None, reduction='mean')
```

MSELoss
```python
torch.nn.MSELoss(size_average=None, reduce=None, reduction='mean')
```

CrossEntropyLoss

交叉熵损失函数,多分类
```python
torch.nn.CrossEntropyLoss(weight=None, size_average=None, ignore_index=-100, reduce=None, reduction='mean')

torch.nn.CTCLoss(blank=0, reduction='mean', zero_infinity=False)
```

NLLLoss

负对数似然损失函数(Negative Loss Likelihood),多分类
```python
torch.nn.NLLLoss(weight=None, size_average=None, ignore_index=-100, reduce=None, reduction='mean')
```

PoissonNLLLoss
```python
torch.nn.PoissonNLLLoss(log_input=True, full=False, size_average=None, eps=1e-08, reduce=None, reduction='mean')
```

KLDivLoss

KL散度,又叫相对熵,计算两个分布之间的距离,越相近越接近零
```python
torch.nn.KLDivLoss(size_average=None, reduce=None, reduction='mean')
```

BCELoss

二分类用的交叉熵
```python
torch.nn.BCELoss(weight=None, size_average=None, reduce=None, reduction='mean')
```

BCEWithLogitsLoss

增加了一个Sigmoid层
```python
torch.nn.BCEWithLogitsLoss(weight=None, size_average=None, reduce=None, reduction='mean', pos_weight=None)
```

MarginRankingLoss

评价相似度的损失
```python
torch.nn.MarginRankingLoss(margin=0.0, size_average=None, reduce=None, reduction='mean')
```

HingeEmbeddingLoss

用于学习非线性嵌入或半监督学习
```python
torch.nn.HingeEmbeddingLoss(margin=1.0, size_average=None, reduce=None, reduction='mean')
```

MultiLabelMarginLoss

多类别多分类的Hinge损失
```python
torch.nn.MultiLabelMarginLoss(size_average=None, reduce=None, reduction='mean')
```

其中$ x \in \lbrace 0, \; \cdots , \; \text{x.size}(0) - 1 \rbrace $,
$ y \in \lbrace 0, \; \cdots , \; \text{y.size}(0) - 1 \rbrace $,
$ 0 \leq y[j] \leq \text{x.size}(0)-1 $,$i \neq y[j] $

SmoothL1Loss

也叫Huber Loss,误差在(-1,1)上是平方损失,其他情况是L1损失
```python
torch.nn.SmoothL1Loss(size_average=None, reduce=None, reduction='mean')
```

SoftMarginLoss

多标签二分类问题
```python
torch.nn.SoftMarginLoss(size_average=None, reduce=None, reduction='mean')
```

MultiLabelSoftMarginLoss

多标签多分类
```python
torch.nn.MultiLabelSoftMarginLoss(weight=None, size_average=None, reduce=None, reduction='mean')
```

其中$ i \in \lbrace 0, \; \cdots , \; \text{x.nElement}() - 1\rbrace $,
$ y[i] \in \lbrace 0, \; 1 \rbrace $

CosineEmbeddingLoss

余玄相似度损失
```python
torch.nn.CosineEmbeddingLoss(margin=0.0, size_average=None, reduce=None, reduction='mean')
```

MultiMarginLoss

多分类的Hinge损失
```python
torch.nn.MultiMarginLoss(p=1, margin=1.0, weight=None, size_average=None, reduce=None, reduction='mean')
```

其中$x \in \lbrace 0, \; \cdots , \; \text{x.size}(0) - 1 \rbrace $,$ i \neq y $

TripletMarginLoss
```python
torch.nn.TripletMarginLoss(margin=1.0, p=2.0, eps=1e-06, swap=False, size_average=None, reduce=None, reduction='mean')
```
