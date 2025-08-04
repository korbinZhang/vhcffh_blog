---
date: 2018-05-17
tags: ["Python", "Class"]
description: 本文深入探讨了Python中类与实例的一些特殊属性和方法。内容详细讲解了`self`与`__init__`方法的作用，区分了类属性和实例属性，并展示了如何通过`__class__`访问被实例属性覆盖的类属性。此外，文章还介绍了如何利用`__init__`统计类的实例数量，`__dict__`属性在类和实例中的不同内容，以及如何通过实现`__len__`和`__getitem__`等魔术方法让自定义对象支持内置函数和操作。
---

# python类和实例的一些属性



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
