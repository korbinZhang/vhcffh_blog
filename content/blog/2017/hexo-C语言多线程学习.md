---
date: 2017-09-04
tags: ["C", "Windows", "Thread"]
description: 本文是一篇关于在Windows环境下使用C语言进行多线程编程的学习笔记。文章通过一个简单的实例，详细讲解了如何使用`CreateThread`函数来创建一个新的子线程，并说明了该函数的各个参数的意义和用法。此外，还探讨了如何向线程函数传递参数，以及`WaitForSingleObject`函数在主线程中等待子线程执行完毕的重要性，以避免主程序提前退出导致子线程未执行完成的问题。
---

# C语言多线程学习



VC6++环境下C语言创建多线程

### 1.简单的创建多线程实例

```c
    #include <stdio.h>
    #include <windows.h>
    //子线程函数
    DWORD WINAPI ThreadFun(LPVOID pM){
        printf("子线程的线程ID号为：%d\n子线程输出 Hello World\n", GetCurrentThreadId());
        return 0;
    }
    //主函数，所谓主函数其实就是主线程执行的函数。
    int main()
    {
        printf("最简单的创建多线程实例\n");
        printf("http://zfblog.xyz");

        HANDLE handle = CreateThread(NULL, 0, ThreadFun, NULL, 0, NULL);
        WaitForSingleObject(handle, INFINITE);
        return 0;
    }
```

使用CreateThread函数创建线程
```c
    HANDLE  WINAPI   CreateThread(
               LPSECURITY_ATTRIBUTES   lpThreadAttributes,
               DWORD    dwStackSize,
               LPTHREAD_START_ROUTINE    lpStartAddress,
               LPVOID    lpParameter,
               DWORD   dwCreationFlags,
               LPDWORD   lpThreadId);
```

第一个参数表示线程内核对象的安全属性,一般传入NULL表示使用默认设置\
第二个参数表示线程栈空间大小,传入0表示使用默认大小(1MB)\
第三个参数表示新线程所执行的线程函数地址\
　　　　　　　多个线程可以使用同一个函数地址(线程函数入口)\
第四个参数是传给线程函数的参数\
第五个参数指定额外的标志来控制线程的创建\
　　　　　　　就是控制线程何时运行\
　　　　　　　为0:直接运行\
　　　　　　　为CREATE_SUSPENDED:调用ResumeThread()后运行\
第六个参数将返回线程的ID号,传入NULL表示不需要返回该线程ID号\
函数返回值:成功返回新线程的句柄,失败返回NULL


### 2.关于CreateThread()给线程函数传递参数的问题
```c
    //创建线程时传递参数
    int *parameter;
    CreateThread(NULL, 0, ThreadFun, (void *)parameter, 0, NULL);
    //想到一个问题直接使用全局的static变量会出现什么情况?????
    //parameter是任意类型的地址
    //线程函数中调用参数
    DWORD WINAPI ThreadFun(LPVOID pM)
    {
            //传入的地址指向一个int类型的数据
            int p=*PM;
            return 0;
    }
```

WaitForSingleObject函数作用
```c
    DWORD  WINAPI  WaitForSingleObject(
            HANDLE   hHandle,
            DWORD   dwMilliseconds
    );
```

第一个参数为要等待的内核对象\
第二个参数为最长等待的时间\
　　　　　　为5000:等待5秒\
　　　　　　为0:立即执行\
　　　　　　为INFINITE:无限等待\
函数返回值:WAIT\_OBJECT\_0在指定的时间内对象被触发\
　　　　　　WAIT\_TIMEOUT超过最长等待时间对象仍未被触发\
　　　　　　WAIT\_FAILED传入参数有错误\
函数作用\
首先要知道----线程的句柄在线程运行时是未触发的，结束后触发\
在主函数中调用等待线程执行完毕，然后主函数结束\
不用此函数可能会导致线程没有执行完，主函数结束，程序结束
