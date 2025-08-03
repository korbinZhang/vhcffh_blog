---
date: 2025-06-22
tags: ["GCC", "Build", "Options"]
---

# gcc 编译选项总结

## 有用的编译选项

|             编译选项              | 说明                                                     |
| :-------------------------------: | :------------------------------------------------------- |
|           `-save-temps`           | 保存生成的预处理 `.i`、编译`.s`、汇编 `.o`生成的临时文件 |
|               `-dM`               | 生成预定义的宏信息                                       |
|              `-###`               | 打印(不执行)gcc 调用的各个子命令                         |
|               `-v`                | 可以打印出 gcc 搜索头文件的路径和顺序                    |
|      `-Q --help=optimizers`       | 打印优化选项                                             |
|       `-fdiagnostics-color`       | 通过定义环境变量`GCC_COLORS`来彩色打印诊断信息           |
|        `-print-file-name`         | 显示出 gcc 究竟会连接哪个 libc 库                        |
|               `-P`                | 去掉预处理时生成的行号标记                               |
|             `-DMACRO`             | 命令行中预定义一个宏                                     |
|             `-UMACRO`             | 命令行中取消一个宏                                       |
|           `-Wa,option`            | 将选项`option`传递给汇编器                               |
|             `-Wa,-L`              | 在目标文件中保留局部符号                                 |
|          `-fverbose-asm`          | 生成带有详细信息的汇编文件                               |
|       `-fsanitize=address`        | 生成能检查内存访问错误的可执行文件                       |
|  `-fsanitize=thread -fPIE -pie`   | 生成能检查数据竞争的可执行文件                           |
|           `-Wl,option`            | 将选项`option`传递给连接器                               |
|         `-Wl,-Map=o.map`          | 让连接器生成内存映射文件                                 |
|   `__attribute__ ((__used__))`    | 禁止函数被优化掉                                         |
| `__attribute__ ((always_inline))` | 强制函数永远以 inline 的形式调用                         |
|          `-fsyntax-only`          | 只做语法检查，不进行实际的编译输出                       |
|              `-Wall`              | 打开警告信息                                             |
|               `-x`                | 指定语言类型                                             |
|         `-fpack-struct=2`         | 改变结构体成员的字节对齐                                 |

## 常用的系统库

| 库名称              | GCC 链接命令     | 作用                     |
| :------------------ | :--------------- | :----------------------- |
| math (数学库)       | `-lm`            | 三角函数、对数、指数等   |
| pthread (多线程库)  | `-lpthread`      | POSIX 线程               |
| dl (动态链接库加载) | `-ldl`           | `dlopen` / `dlsym` 等    |
| rt (实时库)         | `-lrt`           | 高精度定时器、实时功能   |
| zlib (压缩库)       | `-lz`            | 压缩与解压缩             |
| ssl/crypto          | `-lssl -lcrypto` | OpenSSL 安全加密库       |
| curl                | `-lcurl`         | 网络库，支持 HTTP/FTP 等 |

## 常用的第三方库

| 库名称   | GCC 链接方式                            | 说明                 |
| :------- | :-------------------------------------- | :------------------- |
| OpenCV   | `-lopencv_core -lopencv_imgproc ...`    | 图像处理与计算机视觉 |
| FFmpeg   | `-lavcodec -lavformat -lavutil ...`     | 音视频编解码         |
| SQLite   | `-lsqlite3`                             | 轻量级数据库         |
| Boost    | `-lboost_system -lboost_filesystem ...` | 通用 C++ 库          |
| protobuf | `-lprotobuf`                            | Google 协议缓冲区    |
| json-c   | `-ljson-c`                              | C 语言 JSON 解析库   |
| yaml-cpp | `-lyaml-cpp`                            | C++ YAML 解析库      |

## 参考

1. [100 个 gcc 小技巧](https://github.com/hellogcc/100-gcc-tips)
