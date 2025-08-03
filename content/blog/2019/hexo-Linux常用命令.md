---
date: 2019-05-21
tags: ["Linux", "Command"]
---

# Linux常用命令



Linux中的一些常用命令,tar

1.tar解压打包相关
------------------------------------------------------------------------

```bash
tar -cvf log.tar log2019.log    #仅打包，不压缩
tar -zcvf log.tar.gz log2019.log   #打包后，以 gzip 压缩
tar -jcvf log.tar.bz2 log2019.log  #打包后，以 bzip2 压缩
tar -ztvf log.tar.gz #gzip查阅
tar -jtvf log.tar.gz #bzip2查阅
tar -zxvf log.tar.gz #gzip解压
tar -jxvf log.tar.gz #bzip2解压
unzip log.zip -d dirname #zip解压到dirname目录
```

补充

c: 建立压缩档案\
-x：解压\
-t：查看内容\
-r：向压缩归档文件末尾追加文件\
-u：更新原压缩包中的文件

这五个是独立的命令，压缩解压都要用到其中一个，可以和别的命令连用但只能用其中一个。下面的参数是根据需要在压缩或解压档案时可选的。

-z：有gzip属性的\
-j：有bz2属性的\
-Z：有compress属性的\
-v：显示所有过程\
-O：将文件解开到标准输出

2.wget设置代理
---------------------------------------------------------------

2.1环境变量中设置

    export http_proxy=http://127.0.0.1:8087

2.2使用配置文件

    # cp /etc/wgetrc ~/.wgetrc
    # vim ~/.wgetrc
    # You can set the default proxies for Wget to use for http, https, and ftp.
    # They will override the value in the environment.
    https_proxy = http://127.0.0.1:8087/
    http_proxy = http://127.0.0.1:8087/
    ftp_proxy = http://127.0.0.1:8087/

    # If you do not want to use proxy at all, set this to off.
    use_proxy = on

3.ps相关命令
---------------------------------------------------------

    ps -ef # 查看进程信息和执行的命令

4.用户文件管理相关
---------------------------------------------------------------------------

4.1Linux系统用户账号的管理

4.1.1添加新的用户账号

    useradd [-d dirname] username
    # [-d dirname]指定用户主目录

4.1.2删除帐号

    userdel [-r] username
    # [-R]把用户的主目录一起删除

4.1.3修改帐号

    usermod [] username

4.1.4用户密码管理

    passwd [-I][-u][-d][-f] username
    # [-I]锁定密码，即禁用账号。
    # [-u]密码解锁。
    # [-d]使账号无密码。
    # [-f]强迫用户下次登录时修改密码。

4.2Linux系统用户组的管理

4.2.1增加一个新的用户组

    groupadd [-g GID] username
    # [-g GID]指定新用户组的组标识号（GID）

4.2.2删除一个已有的用户组

    groupdel groupname

4.2.3修改用户组的属性

    groupmod [-g GID] groupname
    # [-g GID]指定新用户组的组标识号（GID）

4.2.4更改用户组

**如果一个用户同时属于多个用户组，那么用户可以在用户组之间切换，以便具有其他用户组的权限。用户可以在登录后，使用命令newgrp切换到其他用户组，这个命令的参数就是目的用户组。**

    newgrp root

4.3Linux文件用户属性修改

    chown [-R] user_name filename_OR_dirname  # 更改文件或目录的所有者
    chgrp [-R] group_name filename_OR_dirname  # 更改文件或目录所在组
    # [-R]参数递归更改目录下所有文件的用户属性

参考资料
---------------------------------------------

1.<http://man.linuxde.net/tar>

2.<https://www.cnblogs.com/cloud2rain/archive/2013/03/22/2976337.html>

3.<https://www.cnblogs.com/52php/p/5677628.html>

4.<https://www.jb51.net/LINUXjishu/43356.html>
