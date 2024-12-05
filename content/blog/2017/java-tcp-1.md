---
sidebar: false
outline: false
date: 2017-08-10
---

# JAVA 套接字之 TCP 实现聊天室

java 实现聊天室,通过多线程实现随时加入,随时退出

## 客户端程序

客户端有两个线程\
一个线程由主类 SocketClient 实现向服务器发送消息\
一个线程由内部类 readLineThread 实现监听服务器发来的消息并显示

```java
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

public class SocketClient extends Socket{

    private static final String SERVER_IP = "127.0.0.1";
    private static final int SERVER_PORT = 2017;

    private Socket client;
    private PrintWriter out;
    private BufferedReader in;

    /**
     * 与服务器连接，并输入发送消息
     */
    public SocketClient() throws Exception{
        super(SERVER_IP, SERVER_PORT);
        client = this;
        out = new PrintWriter(this.getOutputStream(), true);
        in = new BufferedReader(new InputStreamReader(this.getInputStream()));
        new readLineThread();

        while(true){
            in = new BufferedReader(new InputStreamReader(System.in));
            String input = in.readLine();
            out.println(input);
        }
    }

    /**
     * 用于监听服务器端向客户端发送消息线程类
     */
    class readLineThread extends Thread{

        private BufferedReader buff;
        public readLineThread(){
            try {
                buff = new BufferedReader(new InputStreamReader(client.getInputStream()));
                start();
            } catch (Exception e) {
            }
        }

        @Override
        public void run() {
            try {
                while(true){
                    String result = buff.readLine();
                    if("byeClient".equals(result)){//客户端申请退出，服务端返回确认退出
                        break;
                    }else{//输出服务端发送消息
                        System.out.println(result);
                    }
                }
                in.close();
                out.close();
                client.close();
            } catch (Exception e) {
            }
        }
    }

    public static void main(String[] args) {
        try {
            new SocketClient();//启动客户端
        } catch (Exception e) {
        }
    }
}
```

## 服务器程序

服务器由三个类实现\
主类 Server 监听客户端请求，并启用线程处理请求\
内部类 PrintOutThread 监听输出消息请求，将消息发送到所有客户端\
内部类 ServerThread 提供与每一个用户的连接

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

public class Server extends ServerSocket {

    private static final int SERVER_PORT = 2017;

    private static boolean isPrint = false;// 是否输出消息标志
    private static List user_list = new ArrayList();// 登录用户集合
    private static List<ServerThread> thread_list = new ArrayList<ServerThread>();// 服务器已启用线程集合
    private static LinkedList message_list = new LinkedList();// 存放消息队列

    /**
     * 创建服务端Socket,创建向客户端发送消息线程,监听客户端请求并处理
     */
    public Server() throws IOException {
        super(SERVER_PORT);// 创建ServerSocket
        new PrintOutThread();// 创建向客户端发送消息线程

        try {
            while (true) {// 监听客户端请求，启用一个线程处理
                Socket socket = accept();
                new ServerThread(socket);
            }
        } catch (Exception e) {
        } finally {
            close();
        }
    }

    /**
     * 监听是否有输出消息请求线程类,向客户端发送消息
     */
    class PrintOutThread extends Thread {

        public PrintOutThread() {
            start();
        }

        @Override
        public void run() {
            while (true) {
                //没有打印这句，if里面的语句不会执行，可能是多线程访问isPrint造成的
                System.out.println("运行中。。。"+isPrint);
                if (isPrint) {// 将缓存在队列中的消息按顺序发送到各客户端,并从队列中清除。
                    String message = (String) message_list.getFirst();
                    for (ServerThread thread : thread_list) {
                        thread.sendMessage(message);
                    }
                    message_list.removeFirst();
                    isPrint = message_list.size() > 0 ? true : false;
                }
            }
        }
    }

    /**
     * 服务器线程类
     */
    @SuppressWarnings("unchecked")
    class ServerThread extends Thread {
        private Socket client;
        private PrintWriter out;
        private BufferedReader in;
        private String name;

        public ServerThread(Socket s) throws IOException {
            client = s;
            out = new PrintWriter(client.getOutputStream(), true);
            in = new BufferedReader(new InputStreamReader(client.getInputStream()));
            //in.readLine();
            out.println("成功连上聊天室,请输入你的名字：");
            start();
        }

        @Override
        public void run() {
            try {
                int flag = 0;
                String line = in.readLine();
                while (true) {
                    // 查看在线用户列表
                    if ("showuser".equals(line)) {
                        out.println(this.listOnlineUsers());
                    }
                    if("bye".equals(line)){
                        out.println("bye");
                    break;}
                    // 第一次进入，保存名字
                    if (flag++ == 0) {
                        name = line;
                        user_list.add(name);
                        thread_list.add(this);
                        out.println(name + "你好,可以开始聊天了...");
                        this.pushMessage("Client<" + name + ">进入聊天室...");
                    } else {
                        this.pushMessage("Client<" + name + "> say : " + line);
                    }
                    line = in.readLine();

                }
                out.println("byeClient");
            } catch (Exception e) {
                e.printStackTrace();
            } finally {// 用户退出聊天室
                try {
                    client.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
                thread_list.remove(this);
                user_list.remove(name);
                pushMessage("Client<" + name + ">退出了聊天室");
            }
        }

        // 放入消息队列末尾，准备发送给客户端
        private void pushMessage(String msg) {
            message_list.addLast(msg);
            isPrint = true;
        }

        // 向客户端发送一条消息
        private void sendMessage(String msg) {
            out.println(msg);
        }

        // 统计在线用户列表
        private String listOnlineUsers() {
            String s = "--- 在线用户列表 ---\015\012";
            for (int i = 0; i < user_list.size(); i++) {
                s += "[" + user_list.get(i) + "]\015\012";
            }
            s += "--------------------";
            return s;
        }
    }

    public static void main(String[] args) throws IOException {
        new Server();// 启动服务端
    }
}
```

这里好像出现了多线程问题

```java
@Override
public void run() {
    while (true) {
        //没有打印下面这句，if里面的语句不会执行，可能是这个线程一直访问isPrint,改变它的线程不能访问到它造成的
        System.out.println("运行中。。。"+isPrint);
        if (isPrint) {// 将缓存在队列中的消息按顺序发送到各客户端，并从队列中清除。
            String message = (String) message_list.getFirst();
            for (ServerThread thread : thread_list) {
                thread.sendMessage(message);
            }
            message_list.removeFirst();
            isPrint = message_list.size() > 0 ? true : false;
        }
    }
}
```
