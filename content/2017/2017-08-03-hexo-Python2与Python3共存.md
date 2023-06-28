+++
title = "Python2与Python3共存"
date = 2017-08-03

[taxonomies]
categories = ["编程"]
tags = ["python"]
+++

在windows下安装多个版本的python

# 安装两个版本的Python

选择想要安装的版本下载例如:\
python2下载地址:<https://www.python.org/ftp/python/2.7.13/python-2.7.13.msi>\
python3下载地址:<https://www.python.org/ftp/python/3.6.2/python-3.6.2.exe>

进行安装(安装顺序随便)\
尽量安装到同一目录下的两个文件夹例如:\
python2安装在"D:\\program\\python27\\"下\
python3安装在"D:\\program\\python36\\"下

# 添加环境变量

Path中要有一下四个路径

    D:\program\python\Python36\Scripts\
    D:\program\python\Python36\
    D:\program\python\python27\Scripts
    D:\program\python\python27\

# 更改python.exe名字

找到找到两个python的安装目录\
`D:\program\python\Python36\python.exe`\
更改为\
`D:\program\python\Python36\python3.exe`\
`D:\program\python\Python27\python.exe`\
更改为\
`D:\program\python\Python36\python2.exe`\
此时两个版本的python已经共同存在\
但还要对pip进行修改

# 更改pip名称

重装python2和python3的pip

    python2 -m pip install --upgrade pip --force-reinstall
    python3 -m pip install --upgrade pip --force-reinstall

重装成功后进行如下测试\
test.PNG...\
可见python2和python3已经共存\
pip的问题也解决了\
但直接调用pip是还能执行并且是后安装的pip的版本\
python命令已经不存在\
直接运行py结尾的文件时会出现问题\
python自带的编辑器出现了两个
