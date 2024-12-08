---
data: 2017-09-05
---

# C 实现简单 TCP 通信

## 添加所需的 window 库

在 VC6++下编程\
代码用到了其他的 lib 库,需要添加\
工程---\>设置---\>Link---\>library
modules 添加 ws2_32.lib(与其他 lib 用空格隔开)

## 服务器端代码

```c
#include"winsock2.h"
#include "stdio.h"

#define SERVER_PORP 8884//服务器端口号

void main()
{
    //加载套接字（winsock）库，
    //加载这段代码拷贝于MSDN中WSAStartup的介绍
    WORD wVersionRequested;
    WSADATA wsaData;
    int err;
    wVersionRequested = MAKEWORD( 1, 1 );
    //版本号为1.1
    err = WSAStartup( wVersionRequested, &wsaData );
    if ( err != 0 ) {
        return;
    }
    if ( LOBYTE( wsaData.wVersion ) != 1 ||
    HIBYTE( wsaData.wVersion ) != 1 ) {
        WSACleanup( );
        return;
    }

    //创建套接字
    SOCKET sockServer=socket(AF_INET,SOCK_STREAM,0);
    //AF_INET指协议簇
    //SOCK_STREAM参数设置为TCP连接

    SOCKADDR_IN addrServer;
    //设置服务器端套接字的相关属性
    addrServer.sin_addr.S_un.S_addr=htonl(INADDR_ANY);
    //设置IP
    addrServer.sin_family=AF_INET;
    addrServer.sin_port=htons(SERVER_PORP);
    //设置端口号

    //将套接字绑定到本地地址和指定端口上
    bind(sockServer,(SOCKADDR*)&addrServer,sizeof(SOCKADDR));
    //将套接字设置为监听模式，并将最大请求连接数设置成5，超过此数的请求全部作废
    listen(sockServer,5);
    SOCKADDR_IN addrClient; //用来接收客户端的设置，包括IP和端口
    int len=sizeof(SOCKADDR);
    while(1) //不断监听
    {
        //得到创建连接后的一个新的套接字，用来和客户端进行沟通，原套接字继续监听客户的连接请求
        SOCKET sockConn=accept(sockServer,(SOCKADDR*)&addrClient,&len);
        if(sockConn!=INVALID_SOCKET) //创建成功
        {
            char sendInfo[100];
            //inet_ntoa将结构转换为十进制的IP地址字符串
            sprintf(sendInfo,"welcome %s to this Server!",inet_ntoa(addrClient.sin_addr));
            //成功建立连接后向客户端发送数据，结果将显示在客户端上
            send(sockConn,sendInfo,strlen(sendInfo)+1,0);
            //从客户端接收数据，结果显示在服务器上
            char recvInfo[100];
            recv(sockConn,recvInfo,100,0);
            printf("%s\n",recvInfo);

            while(1)
            {
                if(recv(sockConn,recvInfo,100,0)<0)
                    break;                  //客户端断开recv返回负值
                printf("%s\n",recvInfo);

                sprintf(sendInfo,recvInfo);
                send(sockConn,sendInfo,strlen(sendInfo)+1,0);
                sprintf(sendInfo,"\nsever receive this text!\n");
                send(sockConn,sendInfo,strlen(sendInfo)+1,0);
            }

            //将本次建立连接中得到套接字关闭
            closesocket(sockConn);
        }
        else
        {
            int errCode=WSAGetLastError();
            printf("the errcode is:%d\n",errCode);
        }
    }
    //如果本程序不是死循环，那么在此处还应添加以下代码：
    closesocket(sockServer); //对一直处于监听状态的套接字进行关闭
    WSACleanup(); //终止对winsocket库的使用
}
```

## 客户端代码

```c
#include "winsock2.h"
#include "stdio.h"

#define SERVER_IP   "127.0.0.1" //服务器IP地址
#define SERVER_PORP 8884        //服务器端口号

void main()
{
    //加载套接字库
    WORD wVersionRequested;
    WSADATA wsaData;
    int err;
    wVersionRequested = MAKEWORD( 1, 1 ); //版本好为1.1
    err = WSAStartup( wVersionRequested, &wsaData );
    if ( err != 0 ) {
        return;
    }
    if ( LOBYTE( wsaData.wVersion ) != 1 ||
    HIBYTE( wsaData.wVersion ) != 1 ) {
        WSACleanup( );
        return;
    }
    SOCKET sockClient=socket(AF_INET,SOCK_STREAM,0); //SOCK_STREAM参数设置为TCP连接
    SOCKADDR_IN addrServer; //服务器地址结构
    addrServer.sin_addr.S_un.S_addr=inet_addr(SERVER_IP); //服务器地址
    addrServer.sin_port=htons(SERVER_PORP); //服务器端口号
    addrServer.sin_family=AF_INET;
    //与服务器端建立连接，进行通信
    int connReult=connect(sockClient,(SOCKADDR*)&addrServer,sizeof(SOCKADDR));
    if(connReult!=WSAEADDRNOTAVAIL) //访问成功
    {
        //成功建立连接后向服务器端发送数据，结果将显示在服务器端上
        char sendInfo[100];
        send(sockClient,"this is zhangsan!",strlen("this is zhangsan!")+1,0);
        //接收来自服务器端发送来的信息
        char recvInfo[100];
        recv(sockClient,recvInfo,100,0);
        printf("%s\n",recvInfo);
        while(1)
        {
            scanf("%s",sendInfo);
            send(sockClient,sendInfo,strlen(sendInfo)+1,0);
            recv(sockClient,recvInfo,100,0);
            printf("%s",recvInfo);
            recv(sockClient,recvInfo,100,0);
            printf("%s",recvInfo);
        }
    }
    else
    {
        int errCode=WSAGetLastError();
        printf("the errcode is:%d\n",errCode);
    }
    closesocket(sockClient);
    WSACleanup();
}
```

客户端和服务器应分别属于两个 exe\
先运行服务器，后运行客户端
