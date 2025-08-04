---
date: 2019-03-20
tags: ["Java", "Annotation"]
description: 本文介绍了Java中的注解（Annotation）及其使用。主要讲解了三种标准注解（@Override, @Deprecated, @SuppressWarnings）和四种元注解（@Target, @Retention, @Documented, @Inherited）的功能与用法，并提及了Java 7和8中新增的@SafeVarargs, @FunctionalInterface, @Repeatable注解。
---

# java注解的使用



### 1.三种标准注解

-   \@Override,表示当前的方法定义覆盖了父类中的方法。必须要有相同的方法签名即(方法名，参数类型，参数顺序，参数个数)都一样。否则在编译过程中发出错误提示。

-   \@Deprecated,对不应该再使用的方法添加注解，当使用这个方法的时候，会在编译时候显示提示信息。

-   \@SuppressWarnings,关闭不当的编译器报警信息

### 2.四种元注解：

-   \@Target,表示该注解可以用什么地方。如CONSTRUCTOR,构造器声明；FIELD,域声明;METHOD,方法声明;TYPE，类，接口或enum声明

-   \@Retention,表示需要在什么级别保存该注解信息。如SOURCE,注解将被编译器丢弃；CLASS,注解在class文件可用，但会被VM丢弃RUNTIME,VM将在运行期间也保留注解，可以使用反射机制读取注解信息

-   \@Documented,将此注解包含到Javadoc中。

-   \@Inherited,允许子类继承父类的注解。

Java 7开始，额外添加了 3 个注解:

-   \@SafeVarargs - Java 7
    开始支持，忽略任何使用参数为泛型变量的方法或构造函数调用产生
-   \@FunctionalInterface - Java 8
    开始支持，标识一个匿名函数或函数式接口。

-   \@Repeatable - Java 8
    开始支持，标识某注解可以在同一个声明上使用多次。
