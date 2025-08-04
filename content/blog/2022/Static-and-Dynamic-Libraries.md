---
date: 2022-08-10
description: "本文总结了C/C++中静态库与动态库的使用方法。内容详细对比了两种链接方式的优缺点，并以Linux环境为例，通过具体代码和编译命令，演示了如何创建（.a和.so文件）、链接和运行使用静态库与动态库的程序，还提及了运行时加载动态库的方法。"
tags: ["C", "Library", "Linker"]
---

# 动态库与静态库



### 链接库

链接库的行为是代码依赖管理的一种形式。
当任何应用程序运行时，其可执行代码都会加载到内存中。
此外，它所依赖的任何代码库也会加载到内存中。
有两种类型的链接：静态的和动态的。
两者都为开发人员提供了不同的好处，应该根据这些好处来选择合适的链接方式。
这篇博文将介绍每种方法提供的好处，然后解释如何在Linux上创建和链接您自己的库的基础知识。

------

### 动态链接

链接动态库时，没有任何库代码直接包含在链接目标中。
相反，在解析符号之前，这些库会在运行时加载到内存中。
因为代码不是静态链接到可执行二进制文件中的，所以在运行时加载有一些好处。
主要是，可以使用新功能或错误修复来更新库，而无需重新编译和重新链接可执行文件。
此外，在运行时加载意味着各个代码库可以拥有自己的初始化程序，并在从内存中卸载之前在自己的任务之后进行清理。

#### 动态库

动态库是一种 Mach-O 二进制文件，在应用程序启动或运行时加载。
由于动态库中的可执行代码不是静态链接到目标可执行文件，因此在需要重用相同代码时提供了一些好处。
例如，如果您有一个应用程序和一个守护程序或扩展程序需要使用相同的代码，那么该代码只需要存在于一个位置——动态库中，而不是同时存在于可执行文件的二进制文件和守护程序的二进制文件中。
由于动态库是在运行时加载的，因此库负责告诉链接器需要哪些附加代码。
这消除了管理您使用的所有代码需要操作的负担。
接下来通过一个简单的例子演示动态库的使用。

#### 构建

首先构建一个libmax.so的动态库。

```c
// max.c
#include "max.h"

int max( int a, int b ) {
    if ( a > b ) {
        return a;
    } else {
        return b;
    }
}
```

```c
// max.h
#ifndef _MAX_H_
#define _MAX_H_

int max( int a, int b );

#endif
```

```c
// main.h
#include "max.h"
#include <stdio.h>

int main() {
    int a = 0, b = 1;
    printf("a: %d, b: %d max: %d\n", a, b, max(a,b));
    return 1;
}
```

##### 编译

```bash
# -fPIC是编译选项，PIC是 Position Independent Code 的缩写，表示要生成位置无关的代码，这是动态库需要的特性
gcc -o max.o -c max.c -fPIC
gcc -o main.o -c main.c
```

##### 生成动态库

```bash
# -shared是链接选项，告诉gcc生成动态库而不是可执行文件
gcc -o libmax.so max.o -shared
```

#### 链接

```bash
gcc -o main main.o -L . -lmax
```

#### 运行

```
$ ./main
./main: error while loading shared libraries: libmax.so: cannot open shared object file: No such file or directory
$ ldd ./main
        linux-vdso.so.1 (0x00007fff00bda000)
        libmax.so => not found
        libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007efe58c48000)
        /lib64/ld-linux-x86-64.so.2 (0x00007efe58e21000)
```
直接运行会出错，因为动态库需要在运行是加载，需要一些配置指定动态库的位置。
通过ldd命令可以查看到系统确实libmax.so的动态库。
有两种方法可以运行我们的程序
1. 添加环境变量`LD_LIBRARY_PATH`
    ```
    $ LD_LIBRARY_PATH=. ./main
    a: 0, b: 1 max: 1
    ```
2. 将libmax.so安装到系统，并通过ldconfig更新动态库，可以通过makefile文件编写安装和卸载规则。\
   当然`install`和`uninstall`需要root权限
    ```makefile
    OUTPUT:=./build
    LIBDIR:=${OUTPUT}/lib
    BINDIR:=${OUTPUT}/bin
    
    main: main.o libmax.so
    	@mkdir -p ${BINDIR}
    	gcc -o ${BINDIR}/main ${OUTPUT}/main.o -L ${LIBDIR} -lmax
    
    main.o: main.c
    	@mkdir -p ${OUTPUT}
    	gcc -o ${OUTPUT}/main.o -c main.c
    
    max.o: max.c
    	@mkdir -p ${OUTPUT}
    	@# -fPIC是编译选项，PIC是 Position Independent Code 的缩写，表示要生成位置无关的代码，这是动态库需要的特性
    	gcc -o ${OUTPUT}/max.o -c max.c -fPIC
    
    libmax.so: max.o
    	@mkdir -p ${LIBDIR}
    	@# -shared是链接选项，告诉gcc生成动态库而不是可执行文件
    	gcc -o ${LIBDIR}/libmax.so ${OUTPUT}/max.o -shared
    
    install: main
    	@# 安装文件
    	cp ${LIBDIR}/libmax.so /usr/lib	
    	cp ${BINDIR}/main /usr/bin
    	@# ldconfg更新/etc/ld.so.cache
    	ldconfig
    uninstall:
    	rm -rf /usr/lib/libmax.so
    	rm -rf /usr/bin/main
    	ldconfig

    clean:
    	rm -rf build
    ```

#### 运行时加载

还有一种可以直接在程序运行时指定动态库的路径，并通过系统api直接加载，这样的好处是程序可以只更新部分组件。具体的使用方法参考[dlopen(3) - Linux man page](https://linux.die.net/man/3/dlopen)。

```c
#include <dlfcn.h>
void *dlopen(const char *filename, int flag);
char *dlerror(void);
void *dlsym(void *handle, const char *symbol);
int dlclose(void *handle);
```

------

### 静态链接

与动态链接不同，静态链接将库中的代码包含到目标的二进制文件中。
这会导致目标程序占用磁盘空间变大，启动时间变慢。
因为库的代码直接添加到链接目标的二进制文件中，这意味着要更新库中的任何代码，都必须重建链接目标。

#### 静态库

静态库是一组目标文件的容器。
静态库使用来自`ar`进行构建，类型的文件扩展名“.a”。
接下来通过一个简单的例子演示静态库的使用。

#### 构建

这里构建一个libmax.a的动态库。
(相关代码与动态库例子相同。)

##### 编译

```bash
gcc -o max.o -c max.c
gcc -o main.o -c main.c
```

##### 生成静态库

静态库的生成使用`ar`工具，具体的使用可以参考[linux man](https://linux.die.net/man/1/ar)
```bash
ar cr libmax.a max.o
```

#### 链接

```bash
gcc -o main main.o -L . -lmax
```

#### 运行

直接运行即可，可以比较一下动态库和静态库生成的两个程序的大小，显然动态库生成的程序更小

```bash
# 静态链接生成的程序
$ ls -all ./main
-rwxr-xr-x 1 frey frey 16664 Aug 10 20:54 ./main

# 动态链接生成的程序
$ ls -all ./main
-rwxr-xr-x 1 frey frey 16640 Aug 11 22:54 ./main
```

### 参考
1. [Static and Dynamic Libraries](https://pewpewthespells.com/blog/static_and_dynamic_libraries.html)
2. [C语言丨静态库与动态库的区别，你知道多少？](https://zhuanlan.zhihu.com/p/307640255)
3. [Linux动态库生成与使用指南](https://www.cnblogs.com/jiqingwu/p/linux_dynamic_lib_create.html)
4. [dlopen(3) - Linux man page](https://linux.die.net/man/3/dlopen)
5. [ar(1) - Linux man page](https://linux.die.net/man/1/ar)

