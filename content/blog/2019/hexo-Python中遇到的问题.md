---
date: 2019-05-31
tags: ["Python", "List"]
---

# Python中遇到的问题



1.列表的初始化

当初始化一个n×n的列表时不能使用如下方法，

    In [1]: l=[[0]*3]*3 #如此初始化会导致其它行仅是第一行的引用而不是copy
    In [2]: l
    Out[2]: [[0, 0, 0], [0, 0, 0], [0, 0, 0]
    In [3]: l[0][0]=1 #改变其中一行的某个元素
    In [4]: l
    Out[4]: [[1, 0, 0], [1, 0, 0], [1, 0, 0]] #其他行跟着改变

正确的方法应该如下

    In [5]: l=[[0 for _ in range(3)] for _ in range(3)] #或者l=[[0]*3 for _ in range(3)]
    In [6]: l
    Out[6]: [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
    In [7]: l[0][0]=1
    In [8]: l
    Out[8]: [[1, 0, 0], [0, 0, 0], [0, 0, 0]]

2.a is b与a==b 的区别

    a='vhcffh.com'
    b='vhcffh.com'
    a==b # True,a和b对应实例的内容是相同的
    a is b # False,a和b指向不同的实例
    b=a
    a is b # True,a和b指向同一个实例

    # 好奇怪啊！！！
    In [43]: a='vhcffh.com'
    
    In [44]: b='vhcffh.com'
    
    In [45]: a==b
    Out[45]: True
    
    In [46]: a is b
    Out[46]: False
    
    In [47]: a='abcde'
    
    In [48]: b='abcde'
    
    In [49]: a == b
    Out[49]: True
    
    In [50]: a is b
    Out[50]: True
