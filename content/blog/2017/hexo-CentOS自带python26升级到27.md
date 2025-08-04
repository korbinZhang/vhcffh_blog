---
date: 2017-09-12
tags: ["CentOS", "Python"]
description: 本文详细介绍了在CentOS系统中将自带的Python 2.6版本升级到2.7.3的具体步骤。内容涵盖了从官网下载Python 2.7.3源码包，通过编译安装（configure, make, make install）完成新版本的部署，以及如何通过建立软链接（ln -s）将系统默认的python命令指向新安装的2.7版本。同时，文章还特别指出了升级后需要修复yum命令对旧版Python依赖的问题，通过修改`/usr/bin/yum`文件确保系统工具的正常运行。
---

# CentOS自带python26升级到27



1.下载安装

    #下载
    wget http://python.org/ftp/python/2.7.3/Python-2.7.3.tar.bz2
    #解压并更改目录   
    tar -jxvf Python-2.7.3.tar.bz2
    cd Python-2.7.3
    #编译安装
    ./configure
    make all
    make install
    make clean
    make distclean

安装需要gcc(如果系统没有gcc需要自己安装)

    yum install -y gcc

查看版本信息

    [root@host ~]# /usr/local/bin/python2.7 -V
    Python 2.7.3
    [root@host ~]# python -V
    Python 2.6.6

python2.7已经安装,但系统的python还是2.6

2.建立软连接

使系统默认的python指向python2.7

    rm /usr/bin/python /usr/bin/python2.6
    ln -s /usr/local/bin/python2.7 /usr/bin/python

但yum命令依赖python2.6.6，需要更改一些配置文件

    su root                         ##切换到root  
    vi /usr/bin/yum                 ##打开文件

~~/usr/bin/python~~ \#\#删除此行\
/usr/bin/python2.6.6 \#\#改为此行\
更改需要管理员权限

参考资料

1.<http://blog.csdn.net/jcjc918/article/details/11022345>
