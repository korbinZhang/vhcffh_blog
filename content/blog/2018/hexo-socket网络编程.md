---
date: 2018-10-18
---

# socket网络编程



### socket网络编程

    int inet_aton(const char *cp, struct in_addr *inp);

转换网络主机地址为二进制数值并存储与第二个参数中\
函数返回0表示主机地址无效，非0表示主机地址有效\
转化完后需要调用htons或htonl函数才能将主机字节序转换为网络字节序用于网络传输

    char *inet_ntoa(struct in_addr in);

转换网络字节序为标准的ASCII以点分开的地址，函数返回字符串指针\
该字符串空间为静态分配，第二次调用时会覆盖第一次的内容

    in_addr_t inet_addr(const char *cp);

转换网络主机地址为网络字节序二进制值\
参数无效，返回-1(INADDR\_NONE)\
注意：转换255.255.255.255时也返回-1

    int inet_pton(int af, const char *src, void *dst);

转换字符串到网络地址，af是地址簇，*src是来源地址，*
dst接收转换后的数据。

    const char *inet_ntop(int af, const void *src, char *dst, socklen_t cnt);

转换网络字节序二进制值到ASCII类型的地址，参数的作用和inet\_pton相同，\
socklen\_t
cnt指所指向缓存区dst的大小，避免溢出，如果缓存区太小无法存储地址的值，则返回一个空指针，并将errno置为ENOSPC。

    int select(int maxfdp,fd_set *readfds,fd_set *writefds,fd_set *errorfds,struct timeval*timeout);

int maxfdp
指集合中所有文件描述符的范围，即所有文件描述符的最大值加1，不能错！在Windows中这个参数的值无所谓，可以设置不正确。\
struct fd\_set
可以理解为一个集合，这个集合中存放的是文件描述符(filedescriptor)，即文件句柄。监视这些文件描述符的读变化

    int setsockopt(SOCKET s,int level,int optname,const char* optval,int optlen);

s(套接字): 指向一个打开的套接口描述字\
level:(级别)： 指定选项代码的类型。\
SOL\_SOCKET: 基本套接口\
IPPROTO\_IP: IPv4套接口\
IPPROTO\_IPV6: IPv6套接口\
IPPROTO\_TCP: TCP套接口\
optname(选项名)： 选项名称\
optval(选项值): 是一个指向变量的指针 类型：整形，套接口结构，
其他结构类型:linger{}, timeval{ }\
optlen(选项长度) ：optval 的大小

    int PASCAL FAR recvfrom( SOCKET s, char FAR* buf, int len, int flags,struct sockaddr FAR* from, int FAR* fromlen);

s：标识一个已连接套接口的描述字。\
buf：接收数据缓冲区。\
len：缓冲区长度。\
flags：调用操作方式。\
from：（可选）指针，指向装有源地址的缓冲区。\
fromlen：（可选）指针，指向from缓冲区长度值。

### 参考资料

1.<https://blog.csdn.net/zyy617532750/article/details/58595700>\
2.<https://www.cnblogs.com/zhoudingcocng/p/6209961.html>
