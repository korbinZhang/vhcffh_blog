---
date: 2017-08-04
tags: ["VPS", "Linux", "Web Server"]
description: 本文是一篇在搬瓦工（Bandwagon Host）的CentOS VPS上搭建Web服务器的教程。文章详细记录了安装Apache、PHP和MySQL（LAMP环境）的全过程。内容包括使用`yum`命令分别安装httpd、php及其常用组件、mysql-server等软件包，以及如何使用`service`命令启动、停止和重启各项服务。此外，还介绍了如何通过`chkconfig`命令将服务设置为开机自启动，并讲解了如何为MySQL的root账户设置初始密码，为搭建一个完整的网站运行环境提供了清晰的步骤指导。
---

# 搬瓦工VPS搭建Web服务器



记录在centos上安装apache+php+mysql\
搬瓦工VPS[购买地址](https://bandwagonhost.com/aff.php?aff=17697)

# 安装apache

安装`yum install httpd`\
启动`service httpd start`\
暂停`service httpd stop`\
重启`service httpd restart`

检查开机启动情况`chkconfig --list httpd`\
默认情况下是全部关闭的，尽量设置开机启动，以防主机意外关机

设置开机启动命令`chkconfig httpd on`\
再次检查启动情况，看到2，3，4，5为启动\
关闭开机启动命令`chkconfig httpd off`

到此Apache安装完成，在自己浏览器中输入主机IP和端口号能正常打开

# 安装php

命令为:

    yum install php
    yum install php-mysql  php-gd  php-imap  php-ldap  php-odbc php-pear  php-xml  php-xmlrpc
    yum install php-mysql

以上命令为安装php及其支持的组件

# 安装mysql

## 安装
------------------------------------------

首先查看主机是否已经安装`rpm -qa|grep mysql`\
注意：可能检查中安装有php-mysql XXXXX 和
mysql-libXXXX,这是刚刚第二步安装的php的组件,不必理会

已经安装的话就执行删除命令`rpm -e mysql`

然后继续安装\
使用命令yum list \| grep mysql\
来查看yum上提供的mysql数据库可下载的版本

安装命令`yum install -y mysql-server mysql mysql-devel`\
等待一段时间安装成功

## 配置
------------------------------------------

接下来是对mysql的配置(注意:命令中是"mysqld",不是mysql)\
初始化:`service mysqld start`\
重启:`service mysqld restart`\
配置开机自动启动:`chkconfig mysqld on`

为mysql的root账户设置密码:`mysqladmin -u root password '*********'`\
登录命令`mysql -u root -p`
