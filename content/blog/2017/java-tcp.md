---
date: 2017-08-09
---

# JAVA 套接字之 TCP 简单实用

java 套接字之 TCP

## 单客户端排队与服务器建立连接

客户端程序

```java
import java.net.*;
import java.io.*;

public class Client{
    static Socket server;
    public static void main(String[] args)throws Exception{
        //客户端请求与本机在5678端口建立TCP连接
        server=new Socket(InetAddress.getLocalHost(),5678);
        BufferedReader in=
            new BufferedReader(new InputStreamReader(server.getInputStream()));
        //获取Socket的输入流，用来接收从服务端发送过来的数据
        PrintWriter out=new PrintWriter(server.getOutputStream());
        //获取Socket的输出流，用来发送数据到服务端
        BufferedReader wt=new BufferedReader(new InputStreamReader(System.in));
        //从键盘输入的数据流
        while(true){
            String str=wt.readLine();//读取键盘输入字符串
            out.println(str);//发送数据到服务端
            out.flush();
            if(str.equals("end")){
                break;
            }
            System.out.println(in.readLine());//打印服务器返回的字符串
        }
        server.close();//关闭连接
    }
}
```

服务器程序 1

```java
import java.io.*;
import java.net.*;

public class Server {
    public static void main(String[] args) throws IOException{
        ServerSocket server=new ServerSocket(5678);//通信端口
        while(true){//一个客户端断开连接后，等待与另一个客户端建立连接
            Socket client=server.accept();//accept用于产生"阻塞"，直到接受到一个连接，并且返回一个客户端的Socket对象实例。
            BufferedReader in=
                new BufferedReader(new InputStreamReader(client.getInputStream()));
            PrintWriter out=new PrintWriter(client.getOutputStream());
            while(true){//直到客户端发送end退出循环
                String str=in.readLine();
                System.out.println(str);
                out.println("has receive....");
                out.flush();
                if(str.equals("end"))
                    break;
            }
            client.close();//关闭通信
        }
    }
}
```

## 多个客户端同时与服务器建立连接

客户端程序不变,服务器端阻塞等待客户端连接,并给每个链接分配一个线程

服务器程序 2

```java
import java.io.*;
import java.net.*;

public class Server extends Thread {//继承Thread类
    private Socket client;

    public Server(Socket c){//类初始化，接受参数为客户端的请求
        this.client = c;
    }

    public void run(){//重写run函数
        try{
            BufferedReader in=
                new BufferedReader(new InputStreamReader(client.getInputStream()));
            PrintWriter out=new PrintWriter(client.getOutputStream());
            while(true){
                String str=in.readLine();
                System.out.println(str);
                out.println("has receive....");
                out.flush();
                if(str.equals("end"))
                    break;
            }
            client.close();
        }catch(IOException ex){
        }finally{
        }
    }

    public static void main(String[] args) throws IOException{
        ServerSocket server=new ServerSocket(5678);
        while(true){
            Server mu=new Server(server.accept());//每当有客户端请求就新建一个Server类与之通信
            mu.start();//启动进程
        }
    }
}
```
