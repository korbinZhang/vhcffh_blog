---
date: 2017-09-05
tags: ["C", "TCP", "Socket", "Windows"]
description: 本文介绍了一个使用VC6++环境，基于C语言、TCP套接字和多线程技术开发的简单聊天室程序。文章分别阐述了客户端和服务器端的设计思路。客户端采用双线程模式，一个用于接收用户输入并发送，另一个用于持续接收并显示服务器消息。服务器端则设计了三个线程，主线程负责监听和接受新的用户连接，第二个线程处理来自客户端的消息，第三个线程则将收到的消息广播给所有在线的用户，并通过一个链表来管理所有客户端信息。
---

# VC6聊天室程序设计



了解了C语言多线程的实例和简单的TCP通信，来编写一个简单的聊天室\
曾经java实现的聊天室程序在这里

### 1.客户端程序

客户端需要两个线程，主线程接受用户输入并发送到服务器\
另一个线程监听服务器发来的消息，显示在屏幕上

```c
    #include "winsock2.h"
    #include "stdio.h"

    #define SERVER_IP   "10.80.167.248"
    #define SERVER_PORP 8884

    //blog:zfblog.xyz
    //author:Frey

    DWORD WINAPI ThreadFun(LPVOID pM)  
    {   
        SOCKET sockClient=*(SOCKET *)pM;
        char recvInfo[100];
        while(1)
        {
            if(recv(sockClient,recvInfo,100,0)>0)
            {
                printf("%s",recvInfo);
            }
        }
        return 0;
    }

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
        char name[100];
        printf("请输入姓名:");
        scanf("%s",name);
        int connReult=connect(sockClient,(SOCKADDR*)&addrServer,sizeof(SOCKADDR));
        if(connReult!=WSAEADDRNOTAVAIL) //访问成功
        {
            CreateThread(NULL, 0, ThreadFun, (void *)&sockClient, 0, NULL); 
            printf("连接成功\n");
            //成功建立连接后向服务器端发送数据，结果将显示在服务器端上
            char sendInfo[100];
            sprintf(sendInfo,name);
            send(sockClient,sendInfo,strlen(sendInfo)+1,0);
            //接收来自服务器端发送来的信息
            //char recvInfo[100];
            //recv(sockClient,recvInfo,100,0);
            //printf("%s\n",recvInfo);
            while(1)
            {
                scanf("%s",sendInfo);
                send(sockClient,sendInfo,strlen(sendInfo)+1,0);
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

### 2.服务器程序

用一个链表来存储用户的套接字和姓名\
主线程监听用户的连接，每当有新用户连接，将其信息加入链表，并传入第二个线程\
第二个线程接受客户端发来的信息，并将信息传入第三个线程\
第三个线程从链表中读取用户套接字，将接到的信息转发给所有在线用户

```c
    #include "winsock2.h"
    #include "stdio.h"
    #include <windows.h>

    //blog:zfblog.xyz
    //author:Frey

    #define SERVER_PORP 8884

    struct client_info{
        SOCKET sockConn;
        char name[100];
        client_info *next;
    };//存放每一个用户的信息

    client_info * C_info_head;


    DWORD WINAPI Threadmes(LPVOID pM)
    {
        char sendInfo[100];
        sprintf(sendInfo,(char *)pM);
        for(int i=0;i<=c_info_num;i++){
            SOCKET sockConn=C_info[i].sockConn;
            //if(C_info[i].num!=-1){
            send(sockConn,sendInfo,strlen(sendInfo)+1,0);
            //}
        }
        return 0;
    }

    //将某条消息群发给所有客户端
    void sendmessage(char *message)
    {
        CreateThread(NULL, 0, Threadmes, (void *)message, 0, NULL);
    }
    //接收每个用户的信息
    DWORD WINAPI ThreadFun(LPVOID pM)  
    {   
        client_info c_info = *(client_info *)pM;
        SOCKET sockConn=c_info.sockConn;

        char sendInfo[100];
        //inet_ntoa将结构转换为十进制的IP地址字符串
        //sprintf(sendInfo,"welcome %s to this Server!",inet_ntoa(addrClient.sin_addr));
        //成功建立连接后向客户端发送数据，结果将显示在客户端上
        //send(sockConn,sendInfo,strlen(sendInfo)+1,0);
        //从客户端接收数据，结果显示在服务器上
        char recvInfo[100];
        recv(sockConn,recvInfo,100,0);
        sprintf(c_info.name,recvInfo);

        printf("欢迎%s进入聊天室\n",recvInfo);
        sprintf(sendInfo,"欢迎%s进入聊天室\n",recvInfo);
        sendmessage(sendInfo);


        while(1)
        {   
            if(recv(sockConn,recvInfo,100,0)<0)
                break;
            printf("[%s]:%s\n",c_info.name,recvInfo);
            sprintf(sendInfo,"[%s]:%s\n",c_info.name,recvInfo);
            sendmessage(sendInfo);
        }
        //将本次建立连接中得到套接字关闭
        closesocket(sockConn);
        return 0;
    }


    void main()
    {
        //加载套接字（winsock）库，加载这段代码拷贝于MSDN中WSAStartup的介绍
        WORD wVersionRequested;
        WSADATA wsaData;
        int err;
        wVersionRequested = MAKEWORD( 1, 1 ); //版本号为1.1
        err = WSAStartup( wVersionRequested, &wsaData );
        if ( err != 0 ) {
            return;
        }
        if ( LOBYTE( wsaData.wVersion ) != 1 ||
        HIBYTE( wsaData.wVersion ) != 1 ) {
            WSACleanup( );
            return;
        }
        //消息存储及发送


        //----------------------------------------------------
        //创建套接字
        SOCKET sockServer=socket(AF_INET,SOCK_STREAM,0); //SOCK_STREAM参数设置为TCP连接
        SOCKADDR_IN addrServer; //设置服务器端套接字的相关属性
        addrServer.sin_addr.S_un.S_addr=htonl(INADDR_ANY); //设置IP
        addrServer.sin_family=AF_INET;
        addrServer.sin_port=htons(SERVER_PORP); //设置端口号
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
                c_info_num++;
                C_info[c_info_num].num=c_info_num;
                C_info[c_info_num].sockConn=sockConn;
                CreateThread(NULL, 0, ThreadFun, (void *)&C_info[c_info_num], 0, NULL); 
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

未完成的问题\
用户离线时出现bug\
全部代码:<https://github.com/summerIwinter/Chatroom>
