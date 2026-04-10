---
date: 2026-04-10
description: 总结C++11带来的新特性：nullptr、auto、decltype、lambda、array、forward_list、tuple、move、bind
title: C++11 新特性总结
outline: true
---

C++11 是 C++ 程序设计语言标准的一个重要版本，于 2011 年由 ISO 正式发布，取代了原有的 C++98/03 标准。C++11 在核心语法、STL 标准模板库等方面增加了众多新功能，例如新增 `nullptr`、`auto`、`decltype` 关键字，引入 Lambda 表达式、`std::array`、`std::forward_list`、`std::tuple` 等容器，以及右值引用与移动语义等。下面将对这些新特性逐一总结。

## nullptr

`nullptr` 出现的目的是为了替代 `NULL`。

在某种意义上来说，传统 C++ 会把 `NULL`、0 视为同一种东西，这取决于编译器如何定义 `NULL`，有些编译器会将 `NULL` 定义为 `((void\*)0)`，有些则会直接将其定义为 0。

C++ 不允许直接将 `void *` 隐式转换到其他类型，但如果 NULL 被定义为 `((void*)0)`，那么当编译 `char *ch = NULL;` 时，NULL 只好被定义为 0。

而这依然会产生问题，将导致了 C++ 中重载特性会发生混乱，考虑：

```c++
void foo(char *);
void foo(int);
```

对于这两个函数来说，如果 NULL 被定义为了 0，那么 `foo(NULL);` 这个语句将会去调用 `foo(int)`，从而导致行为违反直觉。

为了解决这个问题，C++11 引入了 nullptr 关键字，专门用来区分空指针、0。

nullptr 的类型为 `nullptr_t`，能够隐式的转换为任何指针或成员指针的类型，也能和他们进行相等或者不等的比较。

**当需要使用 NULL 时候，养成直接使用 nullptr的习惯。**

## 类型推导

C++11 引入了 auto 和 decltype 这两个关键字实现了类型推导，让编译器来操心变量的类型。

### auto关键字

auto 在很早以前就已经进入了 C++，但是他始终作为一个存储类型的指示符存在，与 register 并存。在传统 C++ 中，如果一个变量没有声明为 register 变量，将自动被视为一个 auto 变量。而随着 register 被弃用，对 auto 的语义变更也就非常自然了：可以让编译器自动分析初始值来判断变量所属的类型。当然，使用 auto 必须确定初始值。

使用 auto 进行类型推导的一个最为常见而且显著的例子就是迭代器。在以前我们需要这样来书写一个迭代器：

```c++
for(vector<int>::const_iterator itr = vec.cbegin(); itr != vec.cend(); ++itr)
```

而有了 auto 之后可以：

```c++
// 由于 cbegin() 将返回 vector<int>::const_iterator
// 所以 itr 也应该是 vector<int>::const_iterator 类型
for(auto itr = vec.cbegin(); itr != vec.cend(); ++itr) { /* ... */ }
```

一些其他的常见用法：

```c++
auto i = 5;             // i 被推导为 int
auto arr = new auto(10) // arr 被推导为 int *
auto a = make_shared<string>("hello world"); // a 被推导为 shared_ptr<string>
```

:::note
注意：auto 不能用于函数传参，因此下面的做法是无法通过编译的（考虑重载的问题，我们应该使用模板）。此外，auto 也不能用于推导数组类型。
:::

```c++
int add(auto x, auto y); // 错误：auto 不能用于函数参数
```

```c++
#include <iostream>

int main() {
    auto i = 5;

    int arr[10] = {0};
    auto auto_arr = arr;      // 合法，auto_arr 被推导为 int*
    auto auto_arr2[10] = arr; // 错误：auto 不能用于数组声明

    return 0;
}
```

### decltype关键字

decltype 关键字用于在编译时推导表达式的类型，而不会实际计算表达式的值。它的用法和 `sizeof` 很相似：

```c++
decltype(表达式)
```

例如：

```c++
auto x = 1;
auto y = 2;
decltype(x + y) z; // z 的类型被推导为 int
```

变量 x 和 y 的类型都为 int，让编译器通过推断括号里的表达式来判断 z 的类型。我们很容易得出 z 的类型也为 int。

### 拖尾返回类型、auto 与 decltype 配合

你可能会思考，auto 能不能用于推导函数的返回类型。考虑这样一个例子加法函数的例子，在传统 C++ 中我们必须这么写（T 和 U 可能是不同类型）：

```c++
template<typename R, typename T, typename U>
R add(T x, U y) {
    return x + y;
}
```

这样的代码其实变得很丑陋，因为程序员在使用这个模板函数的时候，必须明确指出返回类型。但事实上我们并不知道 add() 这个函数会做什么样的操作，获得一个什么样的返回类型。

在 C++11 中这个问题得到解决。虽然你可能马上回反应出来使用 decltype 推导 x+y 的类型，写出这样的代码：

```c++
decltype(x + y) add(T x, U y); // 错误：x 和 y 尚未定义
```

但事实上这样的写法并不能通过编译。这是因为在编译器读到 decltype(x+y) 时，x 和 y 尚未被定义。为了解决这个问题，C++11 还引入了一个叫做**拖尾返回类型**（trailing return type），利用 auto 关键字将返回类型后置：

```c++
template<typename T, typename U>
auto add(T x, U y) -> decltype(x + y) {
    return x + y;
}
```

从 C++14 开始是可以直接让普通函数具备返回值推导，因此下面的写法变得合法：

```c++
template<typename T, typename U>
auto add(T x, U y) {
    return x + y;
}
```

## 区间迭代 - 基于范围的 for 循环

C++11 引入了基于范围的迭代写法，我们拥有了能够写出像 Python 一样简洁的循环语句。
最常用的 std::vector 遍历将从原来的样子：

```c++
std::vector<int> arr(5, 100);
for(std::vector<int>::iterator i = arr.begin(); i != arr.end(); ++i) {
    std::cout << *i << std::endl;
}
```

变得非常的简单：

```c++
for(auto i : arr) {
    std::cout << i << std::endl;
}
```

## 初始化列表

在传统 C++ 中，不同的对象有着不同的初始化方法，例如普通数组、POD （plain old data，没有构造、析构和虚函数的类或结构体）类型都可以使用 {} 进行初始化，也就是我们所说的初始化列表。而对于类对象的初始化，要么需要通过拷贝构造函数、要么就需要使用 () 进行。这些不同方法都针对各自对象。在传统C++中可以使用初始化列表如下：

```c++
// 普通数组
int i_arr[3] = { 1, 2, 3 };

// POD类型：结构体
struct A
{
    int x;
    struct B
    {
        int i;
        int j;
    } b;
} a = { 1, { 2, 3 } };

// 拷贝初始化（copy-initialization）
int i = 0;
class Foo
{
    public:
    Foo(int) {}
    Foo(const Foo &);
} foo = 123;  // 需要拷贝构造函数

// 直接初始化：使用 () 进行
int j(0);
Foo bar(123);
```

为了统一初始化方式，并且让初始化行为具有确定的效果，C++11 中提出了列表初始化（List-initialization）的概念。

C++11 首先把初始化列表的概念绑定到了类型上，并将其称之为 `initializer_list`，允许构造函数或其他函数像参数一样使用初始化列表，这就为类对象的初始化与普通数组和 POD 的初始化方法提供了统一的桥梁。可以拿个类模板 `initializer_list` 作为构造函数的参数，则初始化列表就智能用于构造该函数。值得注意的是列表中的元素必须是同一种类型或者可以转化为同一种类型。

【实例】通过初始化列表初始化对象。

```c++
class Foo
{
public:
    Foo(int) {}
private:
    Foo(const Foo &);
};

int main(void)
{
    // 调用Foo(int)构造函数初始化（c++98编译通过 c++11编译通过）
    Foo a1(123);
    // 报错：Foo的拷贝构造函数声明为私有的，该语句属于拷贝初始化，语义上需要拷贝构造函数参与，因此私有拷贝构造会导致编译错误（即使实际可能被优化掉）
    Foo a2 = 123;

    // 列表初始化（c++98编译失败 c++11编译通过）
    Foo a3 = { 123 };
    // 列表初始化（c++98编译失败 c++11编译通过）
    Foo a4 { 123 };

    // 列表初始化（C++98 编译通过，C++11 编译通过）
    int a5 = { 3 };
    // 列表初始化（C++98 编译失败，C++11 编译通过）
    int a6 { 3 };

    return 0;
}
```

在上例中，a3、a4 使用了新的初始化方式来初始化对象，效果如同 a1 的直接初始化。a5、a6 则是基本数据类型的列表初始化方式。可以看到，它们的形式都是统一的。

这里需要注意的是，a3 虽然使用了等于号，但它仍然是列表初始化，语义上需要拷贝构造函数。但在实际编译器（如 g++）中，由于 copy elision 优化，可能不会报错。

a4 和 a6 的写法，是 C++98/03 所不具备的。在 C++11 中，可以直接在变量名后面跟上初始化列表，来进行对象的初始化。

同时列表初始化方法也适用于用new操作等圆括号进行初始化的地方，如下：

```c++
int* a = new int { 123 };
double b = double { 12.12 };
int* arr = new int[3] { 1, 2, 3 };
```

让人惊奇的是在 C++11 中可以使用列表初始化方法对堆中分配的内存的数组进行初始化，而在 C++98/03 中是不能这样做的。

## 模板增强

### 外部模板

传统 C++ 中，模板只有在使用时才会被编译器实例化。只要在每个编译单元（文件）中编译的代码中遇到了被完整定义的模板，都会实例化。这就产生了重复实例化而导致的编译时间的增加。并且，我们**没有办法通知编译器不要触发模板实例化**。

C++11 引入了外部模板，扩充了原来的强制编译器在特定位置实例化模板的语法，使得**能够显式的告诉编译器何时进行模板的实例化**：

```c++
template class std::vector<bool>;            // 强行实例化
extern template class std::vector<double>;  // 不在该编译文件中实例化模板
```

### 尖括号 “>”

在传统 C++ 的编译器中，>> 一律被当做右移运算符来进行处理。但实际上我们很容易就写出了嵌套模板的代码：

```c++
std::vector<std::vector<int>> wow;
```

这在传统C++编译器下是不能够被编译的，而 C++11 开始，连续的右尖括号将变得合法，并且能够顺利通过编译。

### 类型别名模板

在传统 C++ 中，typedef 可以为类型定义一个新的名称，但是却没有办法为模板定义一个新的名称。因为，模板不是类型。例如：

```c++
template<typename T, typename U, int value>

class SuckType
{
public:
    T a;
    U b;
    SuckType()
        : a(value)
        , b(value) {}
};

template<typename U> typedef SuckType<std::vector<int>, U, 1> NewType;   // 不合法
```

C++11 使用 using 引入了下面这种形式的写法，并且同时支持对传统 typedef 相同的功效：

```c++
template <typename T>
using NewType = SuckType<int, T, 1>;    // 合法
```

### 默认模板参数

我们可能定义了一个加法函数：

```c++
template<typename T, typename U>
auto add(T x, U y) -> decltype(x+y) {
    return x+y
}
```

但在使用时发现，要使用 add，就必须每次都指定其模板参数的类型。
在 C++11 中提供了一种便利，可以指定模板的默认参数：

```c++
template<typename T = int, typename U = int>
auto add(T x, U y) -> decltype(x + y) {
    return x + y;
}
```

## 构造函数

### 委托构造

C++11 引入了委托构造的概念，这使得构造函数可以在同一个类中一个构造函数调用另一个构造函数，从而达到简化代码的目的：

```c++
class Base {
public:
    int value1;
    int value2;
    Base() {
        value1 = 1;
    }
    Base(int value) : Base() {  // 委托 Base() 构造函数
        value2 = 2;
    }
};
```

### 继承构造

在继承体系中，如果派生类想要使用基类的构造函数，需要在构造函数中显式声明。
假若基类拥有为数众多的不同版本的构造函数，这样，在派生类中得写很多对应的“透传”构造函数。如下：

```c++
struct A
{
  A(int i) {}
  A(double d,int i) {}
  A(float f,int i,const char* c) {}
  // ...等等系列的构造函数版本
};

struct B:A
{
  B(int i):A(i) {}
  B(double d,int i):A(d,i) {}
  B(float f,int i,const char* c):A(f,i,c) {}
  // ......等等好多个和基类构造函数对应的构造函数
};
```

C++11的继承构造：

```c++
struct A
{
  A(int i) {}
  A(double d,int i){}
  A(float f,int i,const char* c){}
  // ...等等系列的构造函数版本
};

struct B:A
{
  using A::A;
  // 关于基类各构造函数的继承一句话搞定
  // ......
};
```

如果一个继承构造函数不被相关的代码使用，编译器不会为之产生真正的函数代码，这样比透传基类各种构造函数更加节省目标代码空间。

## Lambda表达式

C++11 新标准新增的一项重要功能就是 lambda 表达式，所谓 Lambda 表达式实际上就是提供了一个类似匿名函数的特性，而匿名函数则是在需要一个函数，但是又不想费力去命名一个函数的情况下去使用的。

Lambda 的组成结构与函数很相似，它拥有一个返回类型，一个形参列表，一个函数体。Lambda 也可以定义在函数内部。它的组成结构如下：

```c++
[capture list] (parameter list) option -> return type { function body}
```

- capture list 表示捕获列表，也就是 lambda 所在函数中的局部变量的列表，如果没有，则这个列表为空。
  - [] 不捕获任何变量。
  - [&] 捕获外部作用域中所有变量，并作为引用在函数体中使用（按引用捕获）。
  - [=] 捕获外部作用域中所有变量，并作为副本在函数体中使用(按值捕获)。注意值捕获的前提是变量可以拷贝，且被捕获的变量在 lambda 表达式被创建时拷贝，而非调用时才拷贝。如果希望 lambda 表达式在调用时能即时访问外部变量，我们应当使用引用方式捕获。

    ```c++
    int a = 0;
    auto f = [=] { return a; };
    a += 1;
    cout << f() << endl; // 输出0

    int a = 0;
    auto f = [&a] { return a; };
    a += 1;
    cout << f() <<endl; // 输出1
    ```

  - [=,&foo] 按值捕获外部作用域中所有变量，并按引用捕获 foo 变量。
  - [bar] 按值捕获 bar 变量，同时不捕获其他变量。
  - [this] 捕获当前类中的 this 指针，让 lambda 表达式拥有和当前类成员函数同样的访问权限。如果已经使用了 & 或者 =，就默认添加此选项。捕获 this 的目的是可以在 lamda 中使用当前类的成员函数和成员变量。

```c++
class A
{
 public:
     int i_ = 0;

     void func(int x,int y){
         auto x1 = [] { return i_; };                   // error,没有捕获外部变量
         auto x2 = [=] { return i_ + x + y; };          // OK
         auto x3 = [&] { return i_ + x + y; };        // OK
         auto x4 = [this] { return i_; };               // OK
         auto x5 = [this] { return i_ + x + y; };       // error,没有捕获x,y
         auto x6 = [this, x, y] { return i_ + x + y; };     // OK
         auto x7 = [this] { return i_++; };             // OK
	}
};

int a=0 , b=1;
auto f1 = [] { return a; };                         // error,没有捕获外部变量
auto f2 = [&] { return a++ };                      // OK
auto f3 = [=] { return a; };                        // OK
auto f4 = [=] {return a++; };                       // error,a是以复制方式捕获的，无法修改
auto f5 = [a] { return a+b; };                      // error,没有捕获变量b
auto f6 = [a, &b] { return a + (b++); };                // OK
auto f7 = [=, &b] { return a + (b++); };                // OK
```

- Parameter list 为形参列表。（选填）
- option 是函数选项；可以填 mutable,exception,attribute。（选填）
  - mutable说明lambda表达式体内的代码可以修改被捕获的变量，并且可以访问被捕获的对象的non-const方法。
  - exception说明lambda表达式是否抛出异常以及何种异常。
  - attribute用来声明属性。
  - return type 表示该 lambda 的返回类型。（选填）
- Function body 是函数体，这些和函数表示是一样的。

需要注意的是，如果有返回类型，lambda 必须使用尾置返回来确定类型。另外，lambda 必须包括捕获列表和函数体。另外的几个可以省略。例如：

```c++
auto fun = [] {return 1;};
cout << fun() << endl; // 输出：1

int a = 0;
auto f = [=] { return a; };
a += 1;
cout << f() << endl; // 输出0

int a = 0;
auto f = [&a] { return a; };
a += 1;
cout << f() <<endl; // 输出1
```

我们定义了一个名为 fun 的 lambda 表达式。它只有捕获列表和函数体。这个 lambda 表达式返回值为 1 之后。我们调用这个 lambda，会输出 1。

虽然按值捕获的变量值均复制一份存储在lambda表达式变量中，修改他们也并不会真正影响到外部，但我们却仍然无法修改它们。如果希望去修改按值捕获的外部变量，需要显示指明 lambda 表达式为 mutable。被 mutable 修饰的 lambda 表达式就算没有参数也要写明参数列表。

原因：lambda 表达式可以说是就地定义仿函数闭包的“语法糖”。它的捕获列表捕获住的任何外部变量，最终会变为闭包类型的成员变量。按照 C++ 标准，lambda 表达式的operator() 默认是 const 的，一个 const 成员函数是无法修改成员变量的值的。而 mutable 的作用，就在于取消 operator() 的 const。

```c++
int a = 0;
auto f1 = [=] { return a++; };                // error
auto f2 = [=] () mutable { return a++; };       // OK
```

lambda表达式的大致原理：每当你定义一个 lambda 表达式后，编译器会自动生成一个匿名类（这个类重载了()运算符），我们称为闭包类型（closure type）。那么在运行时，这个 lambda 表达式就会返回一个匿名的闭包实例，是一个右值。所以，我们上面的 lambda 表达式的结果就是一个个闭包。对于复制传值捕捉方式，类中会相应添加对应类型的非静态数据成员。在运行时，会用复制的值初始化这些成员变量，从而生成闭包。对于引用捕获方式，无论是否标记 mutable，都可以在 lambda 表达式中修改捕获的值。至于闭包类中是否有对应成员，C++ 标准中给出的答案是：不清楚的，与具体实现有关。

lambda 表达式是不能被赋值的：

```c++
auto a = [] { cout << "A" << endl; };
auto b = [] { cout << "B" << endl; };

a = b;   // 非法，lambda无法赋值
auto c = a;   // 合法，生成一个副本
```

闭包类型禁用了赋值操作符，但是没有禁用复制构造函数，所以你仍然可以用一个 lambda 表达式去初始化另外一个 lambda 表达式而产生副本。

在多种捕获方式中，最好不要使用 [=] 和 [&] 默认捕获所有变量。

默认引用捕获所有变量，你有很大可能会出现悬挂引用（Dangling references），因为引用捕获不会延长引用的变量的生命周期：

```c++
std::function<int(int)> add_x(int x)
{
    return [&](int a) { return x + a; };
}
```

上面函数返回了一个 lambda 表达式，参数 x 仅是一个临时变量，函数 `add_x` 调用后就被销毁了，但是返回的 lambda 表达式却引用了该变量，当调用这个表达式时，引用的是一个垃圾值，会产生没有意义的结果。上面这种情况，使用默认传值方式可以避免悬挂引用问题。

lambda 表达式可以赋值给对应类型的函数指针。但是使用函数指针并不是那么方便。所以 STL 定义在 < functional > 头文件提供了一个多态的函数对象封装 std::function，其类似于函数指针。它可以绑定任何类函数对象，只要参数与返回类型相同。如下面的返回一个 bool 且接收两个 int 的函数包装器：

```c++
std::function<bool(int, int)> wrapper = [](int x, int y) { return x < y; };
```

lambda 表达式一个更重要的应用是其可以用于函数的参数，通过这种方式可以实现回调函数。

最常用的是在 STL 算法中，比如你要统计一个数组中满足特定条件的元素数量，通过 lambda 表达式给出条件，传递给 `count_if` 函数：

```c++
int value = 3;
vector<int> v {1, 3, 5, 2, 6, 10};
int count = std::count_if(v.begin(), v.end(), [value](int x) { return x > value; });
```

就可以返回 vector 中值大于 3 的元素数量。

当需要遍历容器并对每个元素进行操作时：

```c++
std::vector<int> v = { 1, 2, 3, 4, 5, 6 };
int even_count = 0;
for_each(v.begin(), v.end(), [&even_count](int val){
    if(!(val & 1)){
        ++ even_count;
    }
});
std::cout << "The number of even is " << even_count << std::endl;
```

大部分 STL 算法，可以非常灵活地搭配 lambda 表达式来实现想要的效果。

## 新增容器

### `std::array`

std::array 保存在栈内存中，相比堆内存中的 std::vector，我们能够灵活的访问这里面的元素，从而获得更高的性能。

std::array 会在编译时创建一个固定大小的数组，std::array 不能够被隐式的转换成指针，使用 std::array只需指定其类型和大小即可：

```c++
std::array<int, 4> arr= {1,2,3,4};

int len = 4;
std::array<int, len> arr = {1,2,3,4}; // 非法, 数组大小参数必须是常量表达式1234
```

当我们开始用上了 std::array 时，难免会遇到要将其兼容 C 风格的接口，这里有三种做法：

```c++
void foo(int *p, int len) {
    return;
}

std::array<int, 4> arr = {1,2,3,4};

// C 风格接口传参
// foo(arr, arr.size());           // 非法, 无法隐式转换
foo(&arr[0], arr.size());
foo(arr.data(), arr.size());

// 使用 `std::sort`
std::sort(arr.begin(), arr.end());
```

### `std::forward_list`

`std::forward_list` 是一个列表容器，使用方法和 `std::list` 基本类似。
和 `std::list` 的双向链表的实现不同，`std::forward_list` 使用单向链表进行实现，提供了 O(1) 复杂度的元素插入，不支持快速随机访问（这也是链表的特点），也是标准库容器中唯一一个不提供 `size()` 方法的容器。当不需要双向迭代时，具有比 `std::list`更高的空间利用率。

### 无序容器

C++11 引入了两组无序容器： `std::unordered_set/std::unordered_multiset` 和 `std::unordered_map/std::unordered_multimap`。
无序容器中的元素是不进行排序的，内部通过 Hash 表实现，插入和搜索元素的平均复杂度为 O(1)。

### 元组 std::tuple

元组的使用有三个核心的函数：

- `std::make_tuple`: 构造元组
- `std::get`: 获得元组某个位置的值
- `std::tie`: 元组拆包

```c++
#include <tuple>
#include <iostream>

auto get_student(int id)
{
    // 返回类型被推断为 std::tuple<double, char, std::string>
    if (id == 0)
        return std::make_tuple(3.8, 'A', "张三");
    if (id == 1)
        return std::make_tuple(2.9, 'C', "李四");
    if (id == 2)
        return std::make_tuple(1.7, 'D', "王五");
    return std::make_tuple(0.0, 'D', "null");
    // 如果只写 0 会出现推断错误, 编译失败
}

int main()
{
    auto student = get_student(0);
    std::cout << "ID: 0, "
    << "GPA: " << std::get<0>(student) << ", "
    << "成绩: " << std::get<1>(student) << ", "
    << "姓名: " << std::get<2>(student) << '\n';

    double gpa;
    char grade;
    std::string name;

    // 元组进行拆包
    std::tie(gpa, grade, name) = get_student(1);
    std::cout << "ID: 1, "
    << "GPA: " << gpa << ", "
    << "成绩: " << grade << ", "
    << "姓名: " << name << '\n';
}
```

合并两个元组，可以通过 `std::tuple_cat` 来实现。

```c++
auto new_tuple = std::tuple_cat(get_student(1), std::move(t));
```

## 正则表达式

C++11 提供了正则表达式库，用于操作 std::string 对象，对模式 std::regex (本质是 `std::basic_regex`)进行初始化，通过 `std::regex_match` 进行匹配，从而产生 std::smatch （本质是 `std::match_results` 对象）。

我们通过一个简单的例子来简单介绍这个库的使用。考虑下面的正则表达式：

[a-z]+.txt: 在这个正则表达式中, [a-z] 表示匹配一个小写字母, + 可以使前面的表达式匹配多次，因此 [a-z]+ 能够匹配一个及以上小写字母组成的字符串。在正则表达式中一个 . 表示匹配任意字符，而 . 转义后则表示匹配字符 . ，最后的 txt 表示严格匹配 txt 这三个字母。因此这个正则表达式的所要匹配的内容就是文件名为纯小写字母的文本文件。

`std::regex_match`用于匹配字符串和正则表达式，有很多不同的重载形式。最简单的一个形式就是传入std::string以及一个std::regex进行匹配，当匹配成功时，会返回 true，否则返回 false。例如：

```c++
#include <iostream>
#include <string>
#include <regex>

int main() {
    std::string fnames[] = {"foo.txt", "bar.txt", "test", "a0.txt", "AAA.txt"};
    // 在 C++ 中 `\` 会被作为字符串内的转义符，为使 `\.` 作为正则表达式传递进去生效，需要对 `\` 进行二次转义，从而有 `\\.`
    std::regex txt_regex("[a-z]+\\.txt");
    for (const auto &fname: fnames)
        std::cout << fname << ": " << std::regex_match(fname, txt_regex) << std::endl;
}
```

另一种常用的形式就是依次传入std::string/std::smatch/std::regex三个参数，其中 std::smatch 的本质其实是 `std::match_results`，在标准库中， std::smatch 被定义为了 `std::match_results`，也就是一个子串迭代器类型的 `match_results`。使用 std::smatch 可以方便的对匹配的结果进行获取，例如：

```c++
std::regex base_regex("([a-z]+)\\.txt");
std::smatch base_match;
for(const auto &fname: fnames) {
    if (std::regex_match(fname, base_match, base_regex)) {
        // sub_match 的第一个元素匹配整个字符串
        // sub_match 的第二个元素匹配了第一个括号表达式
        if (base_match.size() == 2) {
            std::string base = base_match[1].str();
            std::cout << "sub-match[0]: " << base_match[0].str() << std::endl;
            std::cout << fname << " sub-match[1]: " << base << std::endl;
        }
    }
}
```

以上两个代码段的输出结果为：

```txt
foo.txt: 1
bar.txt: 1
test: 0
a0.txt: 0
AAA.txt: 0

sub-match[0]: foo.txt
foo.txt sub-match[1]: foo
sub-match[0]: bar.txt
bar.txt sub-match[1]: bar
```

## 语言级线程支持

```c++
std::thread
std::mutex/std::unique_lock
std::future/std::packaged_task
std::condition_variable
```

代码编译需要使用 -pthread 选项。

## 右值引用和move语义

c++11 引入了右值引用和移动语义，为了避免无谓的复制，提高程序性能。

### 左值、右值

C++ 中所有的值都必然属于左值、右值二者之一。左值是指表达式结束后依然存在的持久化对象，右值是指表达式结束时就不再存在的临时对象。所有的具名变量或者对象都是左值，而右值不具名。很难得到左值和右值的真正定义，但是有一个可以区分左值和右值的便捷方法：看能不能对表达式取地址，如果能，则为左值，否则为右值。

```c++
int a = 5; // a是左值， 5是右值
a = b; // a、b 都是左值，只不过将 b 可以当做右值使用
```

### 左值引用、右值引用

C++98 的引用很常见了，就是给变量取了个别名，在 C++11 中，因为增加了右值引用(rvalue reference)的概念，所以 C++98 中的引用都称为了左值引用(lvalue reference)。

```c++
// C++98
int a = 10;
int& refA = a; // refA 是 a 的别名，修改 refA 就是修改 a
               // a 是左值，&refA 是左值引用

int& b = 1; // 编译错误！1 是右值，不能使用左值引用
```

C++11 中的右值引用使用 `&&` 表示：

```c++
int&& a = 1;       // 合法，将不具名(匿名)变量取了个别名
int b = 1;
int&& c = b;       // 编译错误！不能将一个左值绑定到一个右值引用
```

```c++
class A {
  public:
    int a;
};
A getTemp()
{
    return A();
}

A && a = getTemp();   //getTemp()的返回值是右值（临时变量）
```

getTemp()返回的右值本来在表达式语句结束后，其生命也就该终结了（因为是临时变量），而通过右值引用，该右值又重获新生，其生命期将与右值引用类型变量a的生命期一样，只要a还活着，该右值临时变量将会一直存活下去。实际上就是给那个临时变量取了个名字。

:::note
注意：这里a的类型是右值引用类型(int &&)，但是如果从左值和右值的角度区分它，它实际上是个左值。因为可以对它取地址，而且它还有名字，是一个已经命名的右值。
:::

所以，左值引用只能绑定左值，右值引用只能绑定右值，如果绑定的不对，编译就会失败。但是，常量左值引用却是个奇葩，它可以算是一个“万能”的引用类型，它可以绑定非常量左值、常量左值、右值，而且在绑定右值的时候，常量左值引用还可以像右值引用一样将右值的生命期延长，缺点是，只能读不能改。

```c++
const int & a = 1; // 常量左值引用绑定 右值， 不会报错

class A {
  public:
    int a;
};
A getTemp()
{
    return A();
}

const A & a = getTemp();   // 不会报错 而 A& a 会报错
```

### 加入右值引用的目的

个人认为右值引用的目的主要是为了是减少内存拷贝，优化性能。比如下面的代码：

```c++
String Fun()
{
    String str = "hello world";
    return str;
}
```

str 为临时对象，然后调用 String 的拷贝构造函数，将临时对象的值赋值给 String，这种拷贝是完全没有必要的，如果堆内存很大，那么这个拷贝构造的代价会很大，带来了额外的性能损耗。

为了避免临时对象的拷贝构造，我们可以使用移动语义来实现：

```c++
MyString& operator=(MyString&& other)
{
    cout << "MyString& operator=(const MyString&& other)" << endl;
    if (this != &other)
    {
        m_nLen = other.m_nLen;
        m_pData = other.m_pData;
        other.m_pData = NULL;
    }

    return *this;
}
```

我们没有深度拷贝堆内存中的数据，而是仅仅复制了指针，并把源对象 other 的指针置空。事实上，我们“偷取”了属于源对象 other 的内存数据。由于源对象 other 是一个右值，不会再被使用，因此客户并不会觉察到源对象被改变了。在这里，我们并没有真正的复制，所以我们把这个构造函数叫做“转移构造函数”（move constructor），他的工作就是把资源从一个对象转移到另一个对象，而不是复制他们，这样就能避免内存拷贝带来的额外性能消耗。

## std::bind 函数

C++11 引入了新的标准库函数 bind，std::bind 函数定义在头文件 functional 中，是一个函数模板，它就像一个函数适配器，接受一个可调用对象（callable object），生成一个新的可调用对象来“适应”原对象的参数列表。

std::bind 将可调用对象与其参数一起进行绑定，绑定后的结果可以使用 std::function 保存。std::bind 主要有以下两个作用：

将可调用对象和其参数绑定成一个仿函数；
只绑定部分参数，减少可调用对象传入的参数。
std::bind 函数有两种函数原型，定义如下：

```c++
template <class F, class... Args>
/* unspecified */ bind (Fn&& f, Args&&... args);

template <class Ret, class F, class... Args>
/* unspecified */ bind (Fn&& f, Args&&... args);
```

参数说明：

- f：一个可调用对象（可以是函数对象、函数指针、函数引用、成员函数指针、数据成员指针），它的参数将被绑定到 args 上。
- args：绑定参数列表，参数会被值或占位符（std::placeholders）替换，其长度必须与 f 接收的参数个数一致。

### std::bind绑定普通函数

```c++
double my_divide (double x, double y) {return x/y;}
auto fn_half = std::bind (my_divide,_1,2);
std::cout << fn_half(10) << '\n';                        // 5
```

- bind 的第一个参数是函数名，普通函数做实参时，会隐式转换成函数指针。因此`std::bind (my_divide,_1,2)`等价于`std::bind (&my_divide,_1,2)`；
- `_1`表示占位符，位于 `<functional>` 中：`std::placeholders::_1`;

### std::bind绑定一个成员函数

```c++
struct Foo {
    void print_sum(int n1, int n2)
    {
        std::cout << n1+n2 << '\n';
    }
    int data = 10;
};

int main()
{
    Foo foo;
    auto f = std::bind(&Foo::print_sum, &foo, 95, std::placeholders::_1);
    f(5); // 100
}
```

bind 绑定类成员函数时，第一个参数表示对象的成员函数的指针，第二个参数表示对象的地址。
必须显示的指定 `&Foo::print_sum`，因为编译器不会将对象的成员函数隐式转换成函数指针，所以必须在 `Foo::print_sum` 前添加 &；
使用对象成员函数的指针时，必须要知道该指针属于哪个对象，因此第二个参数为对象的地址 &foo；

## std :: function 类模板

类模板 std :: function 是一个通用的多态函数包装器。 std :: function 的实例可以存储，复制和调用任何可调用的目标 ：包括函数，lambda 表达式，绑定表达式或其他函数对象，以及指向成员函数和指向数据成员的指针。当 std::function 对象未包裹任何实际的可调用元素，调用该 std::function 对象将抛出 `std::bad_function_call` 异常。

原型如下：

```c++
template< class R, class... Args >
class function<R(Args...)>;
```

例如：`std::function<int(int,int)> func`;则 function 类的实例 func 可以指向返回值为 int 型，有两个形参都为 int 型的函数。

```c++
#include <functional>
#include <iostream>

int f(int a, int b)
{
    return a + b;
}

int main()
{
    std::function<int(int, int)> func = f;
    std::cout << func(1, 2) << std::endl; // 3
    return 0;
}
```

我们再来先来看看以前 C 和 C++98 的用法：

```c++
#include <iostream>

// C 风格函数
int c_func(int a, int b)
{
    return a + b;
}

// 函数对象
struct functor
{
public:
    int operator() (int a, int b)
    {
        return a + b;
    }
};

int main()
{
    typedef int (*Func)(int, int);
    Func func = c_func;
    std::cout << func(1, 2) << std::endl; // 3

    functor ft;
    std::cout << ft(1, 2) << std::endl; // 3
    return 0;
}
```

从上面我们可以看出，使用 C++11 的 function 类调用函数方便多了。
