+++
title = "python类和实例的一些属性"
date = 2018-05-17

[taxonomies]
categories = ["编程"]
tags = ["Python"]
+++

1.self和__init__()
--------------------------------------------------------------------------

self代表类的实例,如下：
```python
    class Test:
        a,b='classa','classb'#类的属性
        def __init__(self):
            self.b='selfb'#实例的属性
            self.c='selfc'
    print(Test.a)
    print(Test.b)
    #-output:classa classb-访问类的属性
    a=Test()
    print(a.a)
    #-output:classa-通过实例访问类的属性
    print(a.b)
    #-output:selfb-当实例和类都具有某属性时,输出实例属性
    print(a.c)
    print(Test.c)
    #output
```

当实例和类有相同的属性时，如何通过实例访问类的属性呢？\
可以通过\_\_class\_\_访问

2.__class__
------------------------------------------------------

\_\_class\_\_是指实例所对应的类

```python
    # -*- coding: utf-8 -*-
    class Test:
        a='classa'
        print(count)
        def __init__(self):
            self.a='selfa'
            print(self)
            #-output:<__main__.Test object at 0x055A1270>
            print(self.__class__)
            #-output:<class '__main__.Test'>
    a=Test()
    print('实例a',a)
    #-output:<__main__.Test object at 0x055A1270>
    print('类Test',Test)
    #-output:<class '__main__.Test'>
    print(a.a,a.__class__.a)
    #-output:selfa classa
```

通过\_\_init\_\_()可以实现对类的实例的统计

```python
    # -*- coding: utf-8 -*-
    class Test(object):
        count=0
        def __init__(self):
            super(Test, self).__init__()
            self.__class__.count+=1
    if __name__=="__main__":
        a=Test()
        print(Test.count)
        b=Test()
        print(Test.count)
        Test()
        print(Test.count)
```
输出为

    1
    2
    3

每创建一个Test类的实例,Test.count都加1

3.__dict__
---------------------------------------------------

\_\_dict\_\_是一个字典，键是属性名，值为属性值。\
类有自己的\_\_dict\_\_，类的实例也有自己的\_\_dict\_\_
```python
    # -*- coding: utf-8 -*-
    class Test(object):
        classa='classa'
        def __init__(self):
            super(Test, self).__init__()
            self.selfb='selfb'
    if __name__=="__main__":
        print(Test.__dict__)
        a=Test()
        print(a.__dict__)
```
输出为

    {'__module__': '__main__', 'classa': 'classa', '__init__': <function Test.__init__ at 0x04D03468>, '__dict__': <attribute '__dict__' of 'Test' objects>, '__weakref__': <attribute '__weakref__' of 'Test' objects>, '__doc__': None}
    {'selfb': 'selfb'}

可见类Test有classa属性以及一些其他属性\
类Test的实例a只有self.b属性

4.__len__(self)函数
------------------------------------------------------------------------------

返回元素个数，实现len()方法。即类实现了\_\_len\_\_()函数就可以使用len()函数

5.__getitem__(self,key)
-----------------------------------------------------------------------------------------

实现字典一样的功能，当类的实例对象（假设为P）调用P\[key\]时，调用此函数返回。

参考资料
---------------------------------------------

1,[https://docs.python.org](https://docs.python.org/)
