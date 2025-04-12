---
date: 2018-05-17
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
