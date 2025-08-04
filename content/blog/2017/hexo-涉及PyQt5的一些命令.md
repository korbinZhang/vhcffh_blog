---
date: 2017-08-09
tags: ["Python", "PyQt5"]
description: 本文记录了几个与Python PyQt5开发相关的常用命令和技巧。内容涵盖了如何使用`pip`安装PyQt5库，如何利用`pyuic`工具将Qt Designer创建的`.ui`文件转换为Python代码（.py）。在控件使用方面，介绍了如何将`QLineEdit`设置为密码输入模式。最后，文章还讲解了如何使用`pyinstaller`工具将PyQt5应用程序打包成独立的可执行文件（.exe），并对`-F`、`-w`等常用打包参数的含义进行了解释。
---

# 涉及PyQt5的一些命令



记录pyqt5中用到的几个命令
安装

    pip install python-qt5

把ui转py

    python -m PyQt5.uic.pyuic <arguments>

lineEdit输入隐藏，密码

    lineEdit.setEchoMode(QtWidgets.QLineEdit.Password)

py转exe

    pip install pyinstaller
    pyinstaller demo.py

   参数  含义
  ------ ---------------------------------------------------------------
    -F   指定打包后只生成一个exe格式的文件
    -D   --onedir创建一个目录,包含exe文件,但会依赖很多文件（默认选项）
    -c   --console,--nowindowed使用控制台,无界面(默认)
    -F   指定打包后只生成一个exe格式的文件
    -w   --windowed,--noconsole使用窗口,无控制台
    -p   添加搜索路径,让其找到对应的库。
    -i   改变生成程序的icon图标
