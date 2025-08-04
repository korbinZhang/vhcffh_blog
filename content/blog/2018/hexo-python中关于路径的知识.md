---
date: 2018-05-17
tags: ["Python", "OS"]
description: 本文简明扼要地总结了Python中`os`模块里用于处理文件和目录路径的几个常用函数。内容涵盖了获取当前工作目录（`os.getcwd`）、列出目录内容（`os.listdir`）、删除文件（`os.remove`或`os.unlink`）、删除空目录（`os.rmdir`）、递归删除目录（`os.removedirs`）以及更改当前工作目录（`os.chdir`）等基本操作，为Python进行文件系统交互提供了实用的命令参考。
---

# python中关于路径的知识


```python
    os.getcwd()
    #输出当前路径

    os.listdir()
    #输出当前路径下的所有文件夹名和文件名

    os.remove('filename.xxx')和os.unlink('filename.xxx')功能一样
    #删除文件filename.xxx

    os.rmdir('path')
    #删除目录（目录必须为空）

    os.removedirs('p1//p2//p3')
    #依次删除目录p3,p2,p1直到某一目录不为空

    os.chdir('path')
    #更改当前路径
```

参考资料

1.<https://www.cnblogs.com/yanglang/p/7610838.html>\
2.<https://blog.csdn.net/muwinter/article/details/77196261>
