---
date: 2017-12-26
tags: ["Python", "Error"]
description: "本文记录了作者在使用Python过程中遇到的两个具体错误及其解决方案。第一个错误是“ImportError: DLL load failed”，通常是由于安装的pywin32库与Python解释器的位数（32位或64位）不匹配导致，需要下载对应版本的库。第二个错误是使用libsvm时出现的“Exception: LIBSVM library not found.”，原因同样是库文件与Python版本位数不符，解决方法是从特定网站下载预编译的.whl文件并替换其中的库文件。"
---

# python遇到的错误



python使用在中遇到的错误

1.DLL load failed

python ImportError: DLL load failed: %1 不是有效的 Win32 应用程序\
解决方法：去下载与你所安装的Python版本对应的pywin32并安装\
下载链接：<https://sourceforge.net/projects/pywin32/files/pywin32/>\
对应版本和位数\
Python 2.7.13 (v2.7.13:a06454b1afa1, Dec 17 2016, 20:42:59) \[MSC v.1500
32 bit (Intel)\] on win32\
Type "help", "copyright", "credits" or "license" for more information.\
还有一种可能是导入的模块是64位的，而你的python是32位的

2.使用libsvm for python时出错[1]

    Traceback (most recent call last):
      File "C:\Python36\lib\libsvm\python\svm.py", line 28, in <module>
        libsvm = CDLL(path.join(dirname, r'..\windows\libsvm.dll'))
      File "C:\Python36\lib\ctypes\__init__.py", line 348, in __init__
        self._handle = _dlopen(self._name, mode)
    OSError: [WinError 126] 找不到指定的模块。

    During handling of the above exception, another exception occurred:

    Traceback (most recent call last):
      File "train.py", line 3, in <module>
        from libsvm.python.svmutil import *
      File "C:\Python36\lib\libsvm\python\svmutil.py", line 5, in <module>
        from svm import *
      File "C:\Python36\lib\libsvm\python\svm.py", line 38, in <module>
        raise Exception('LIBSVM library not found.')
    Exception: LIBSVM library not found.

出错原因：在github上下载的libsvm中的libsvm.lib是win64版本的，而自己的python版本是32位的\
解决方案：\
方法1.更换python版本（太麻烦了，还要重新下载好多库）\
方法2.去[万能宝库](http://www.lfd.uci.edu/~gohlke/pythonlibs/)上下载对应版本的.whl文件，（不用安装）直接解压后找到[libsvm.lib](https://download.lfd.uci.edu/pythonlibs/o4uhg4xd/libsvm-3.22-cp27-cp27m-win32.whl)更换即可\
2018-09-07 22:11:58

参考资料

1.<https://blog.csdn.net/rena521/article/details/51187981>
