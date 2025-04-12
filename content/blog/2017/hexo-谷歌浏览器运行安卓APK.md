---
date: 2017-06-25
---

# 谷歌浏览器运行安卓APK



使用谷歌浏览器的插件ARChon实现安卓APK在电脑上运行

用谷歌插件在电脑上运行安卓APK

1，直接谷歌应用商店下载出现错误\
程序包无效："CRX\_SIGNATURE\_VERIFICATION\_FAILED"。

2，直接下载crx包参考百度经验

3，出现错误：Cannot load extension with file or directory name
*metadata. Filenames starting with "*" are reserved for use by the
system.\
更改解压后文件夹\_metadata为metadata

4，出现错误：'import' extension is not installed.\
打开文件manifest.json去掉import一句

    "import":[{"id":"mfaihdlpglflfgpfjcifdjdjcckigekc"}],

继续谷歌去掉这句话不对\
看这篇CSDN文章\
说要下载插件ARChon\
(以下废话，直接看5）

4.1，安装成功，但启用后一直白屏

![](http://upload-images.jianshu.io/upload_images/2950376-a275f201f7fdead8.PNG?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

怀疑是不是去掉import一句出问题了

4.2，网上看到开启Native Client\
谷歌浏览器地址栏输入chrome://flags/开启Native Client\
无用

4.3，发现另一个谷歌商店的应用twerk这个应用是把 APK 文件转换成 Chrome
App用的

![](http://upload-images.jianshu.io/upload_images/2950376-2372cf692c93b5a9.PNG?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

5ARChon是谷歌插件要在扩展程序，打钩开发者模式，点击加载已解压扩展程序，选择解压文件夹\
加载ARChon时有警告，可忽略\
先加载ARC Welder出现4的错误后\
再加载ARChon，然后ARC Welder就好了，不好的话重新加载就好了\
安装好了就是APK运行不了

4.3安装的twerk可以把 APK 文件转换一个文件夹\
然后ARC Welder运行\
谷歌浏览器如何运行APK博客CSDN可以试一试

又遇到的问题
---------------------------------------------------------

Chrome加载Android应用，提示"There is no "message" element for key
extName"错误，如：

![](http://upload-images.jianshu.io/upload_images/2950376-0c0702ed3e06b504.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

解决方法：
---------------------------------------------------

找到该Crx文件夹下的"\_locales\\en"目录下的"messages.json"文件，在"extName"节点下，添加"message"字段标签，值对应应用的包名：

![](http://upload-images.jianshu.io/upload_images/2950376-c5a40ac2756b5a87.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

WebGL 不受支持\
知乎有教程\
浏览器快捷方式属性增加---ignore-gpu-blacklist\
开启硬件加速\
试了一下掌阅

![](http://upload-images.jianshu.io/upload_images/2950376-f4ed0ddb2b2d06e1.PNG?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

试了一下简书\
可以运行

![](http://upload-images.jianshu.io/upload_images/2950376-ed37c301d49d7485.PNG?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
