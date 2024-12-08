---
date: 2019-07-04
---

# 优化算法总结

## AdaGrad-Adaptive-Gradient-自适应梯度

```math
g_t = \nabla_\theta J(\theta_{t-1})
```

```math
\theta_{t+1} = \theta_t-\alpha\cdot g_t/\sqrt{\sum_{i=1}^tg_t^2} \ \ \ \ \ (\alpha=0.01)
```

随梯度的变化改变学习率

## RMSProp

```math
g_t = \nabla_\theta J(\theta_{t-1})
```

```math
v_t= \gamma(v_{t-1})+(1-\gamma)g_t^2 \ \ \ \ \ (\gamma=0.9)
```

```math
\theta_{t} = \theta_{t-1}-\alpha* g_t/(\sqrt v_t + \varepsilon) \ \ \ \ \ (\alpha=0.001,\varepsilon=10^{-8})
```

结合梯度平方的指数移动平均数来调节学习率的变化

克服 AdaGrad 梯度急剧减小的问题

## Adam 优化器

```math
g_t = \nabla_\theta J(\theta_{t-1})
```

```math
m_t = \beta_1m_{t-1}+(1-\beta_1)g_t \ \ \ \ \ (\beta_1=0.9,m_0=0)
```

```math
v_t=\beta_2v_{t-1}+(1-\beta_2)g_t^2 \ \ \ \ \ (\beta_2=0.999,v_0=0)
```

```math
\hat m_t = m_t/(1-\beta_1^t)
```

```math
\hat v_t = v_t/(1-\beta_2^t)
```

```math
\theta_t = \theta_{t-1}-\alpha * \hat m_t/(\hat v_t + \varepsilon) \ \ \ \ \ (\alpha=0.001,\varepsilon=10^{-8})
```

对梯度的一阶矩估计（First Moment Estimation，即梯度的均值）和二阶矩估计（Second Moment Estimation，即梯度的未中心化的方差）进行综合考虑，计算出更新步长。

## 下面是对几种梯度下降算法的模拟

其中包括随机梯度下降算法 SGD，小批量梯度下降算法 MSGD，批量梯度下降算法 BGD

都是根据损失函数计算参数梯度，更新参数;不一样的地方是他们使用使用训练集的方式

```python
# 随机梯度下降算法SGD
x=np.random.rand(10000,5)
w=np.array([[1,2,3,4,5],[20,30,40,50,60]])
b=np.array([[10],[100]])
y=(w.dot(x.T)+b).T #100,2
lr=0.5
ww = np.random.rand(2,5)
bb = np.random.rand(2,1)
mb=master_bar(range(1000000))
mb.names=['loss']
lossy=[]
for i in mb:
    r=np.random.randint(1000)
    xi=x[r:r+1,:] #1,5
    yi=y[r:r+1,:] #1,2
    yy = ww.dot(xi.T)+bb #2,1
    loss = np.mean(np.power(yy-yi.T,2)/2)
    lossy.append(loss)
    graphs = [[np.arange(len(lossy)),lossy]]
    mb.update_graph(graphs)
    ww=  ww - lr*(yy-yi.T).dot(xi)
    bb=  bb - lr*(yy-yi.T)
    if loss < 1e-10:
        break
    #print(loss)
print(ww,bb)
print(w,b)

# 小批量梯度下降算法MSGD
x=np.random.rand(1000,5)
w=np.array([[1,2,3,4,5],[20,30,40,50,60]])
b=np.array([[10],[100]])
y=(w.dot(x.T)+b).T #100,2
lr=0.3
ww = np.random.rand(2,5)
bb = np.random.rand(2,1)
mb=master_bar(range(200*3))
mb.names=['loss']
lossy=[]
batch = 50
for i in mb:
    lossg,wwg,bbg=0,0,0
    for j in progress_bar(range(batch),parent=mb):
        r=np.random.randint(1000)
        xi=x[r:r+1,:] #1,5
        yi=y[r:r+1,:] #1,2
        yy = ww.dot(xi.T)+bb #2,10
        lossg += np.mean(np.power(yy-yi.T,2)/2)
        wwg += (yy-yi.T).dot(xi)
        bbg += (yy-yi.T)
    lossy.append(lossg/batch)
    graphs = [[np.arange(len(lossy)),lossy]]
    mb.update_graph(graphs)
    ww=  ww - lr*wwg/batch
    bb=  bb - lr*bbg/batch
    if lossg/batch < 1e-4:
        break
    #print(loss)
print(ww,bb)
print(w,b)

# 批量梯度下降算法BGD
x=np.random.rand(1000,5)
w=np.array([[1,2,3,4,5],[20,30,40,50,60]])
b=np.array([[10],[100]])
y=(w.dot(x.T)+b).T #100,2
lr=0.3
#ww = np.random.rand(2,5)
#bb = np.random.rand(2,1)
mb=master_bar(range(200*3))
mb.names=['loss']
lossy=[]
batch = 1000
for i in mb:
    lossg,wwg,bbg=0,0,0
    for j in progress_bar(range(batch),parent=mb):
        r=j
        xi=x[r:r+1,:] #1,5
        yi=y[r:r+1,:] #1,2
        yy = ww.dot(xi.T)+bb #2,10
        lossg += np.mean(np.power(yy-yi.T,2)/2)
        wwg += (yy-yi.T).dot(xi)
        bbg += (yy-yi.T)
    lossy.append(lossg/batch)
    graphs = [[np.arange(len(lossy)),lossy]]
    mb.update_graph(graphs)
    ww=  ww - lr*wwg/batch
    bb=  bb - lr*bbg/batch
    if lossg/batch < 1e-4:
        break
    #print(loss)
print(ww,bb)
print(w,b)
```
