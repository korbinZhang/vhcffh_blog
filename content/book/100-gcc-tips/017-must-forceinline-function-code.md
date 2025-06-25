# 强制函数永远以 inline 的形式调用

## 例子

    #if defined(__GNUC__)
    #define FORCEDINLINE  __attribute__((always_inline))
    #else
    #define FORCEDINLINE
    #endif

    FORCEDINLINE int add(int a,int b)
    {
      return a+b;
    }

## 技巧

上面的例子是 gcc 的源码。使用 gcc 的扩展功能——函数属性`__attribute__ ((always_inline))`，可以指定该函数永远以 inline 的形式调用

详情参见[gcc 手册](https://gcc.gnu.org/onlinedocs/gcc/Inline.html)

## 贡献者

mengke
