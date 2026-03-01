# 一些 gcc 技巧

## 信息显示

- [打印 gcc 预定义的宏信息](./001-print-predefined-macros.md)
- [打印 gcc 执行的子命令](./002-print-commands-only.md)
- [打印优化级别的对应选项](./003-print-level-options.md)
- [打印彩色诊断信息](./004-diagnostics-color.md)
- [打印头文件搜索路径](./005-print-header-search-dir.md)
- [打印连接库的具体路径](./006-print-file-name.md)

## 预处理

- [生成没有行号标记的预处理文件](./007-inhibit-linemarkers.md)
- [在命令行中预定义宏](./008-define-macro.md)
- [在命令行中取消宏定义](./009-undefine-macro.md)

## 汇编

- [把选项传给汇编器](./010-pass-options-to-assembler.md)
- [生成有详细信息的汇编文件](./011-verbose-asm.md)

## 调试

- [利用 Address Sanitizer 工具检查内存访问错误](./012-address-sanitizer.md)
- [利用 Thread Sanitizer 工具检查数据竞争的问题](./013-thread-sanitizer.md)

## 连接

- [把选项传给连接器](./014-pass-options-to-linker.md)
- [设置动态连接器](./015-set-dynamic-linker.md)

## 函数属性

- [禁止函数被优化掉](./016-must-emit-function-code.md)
- [强制函数 inline](./017-must-forceinline-function-code.md)

## 常见错误

- [error: cast from ... to ... loses precision](./018-cast-lose-precision.md)
- [all warnings being treated as errors](./019-warnings-treated-as-errors.md)
- [gdb 无法调试 gcc 编译的程序]

## 其它

- [只做语法检查](./021-syntax-only.md)
- [保存临时文件](./022-save-temps.md)
- [打开警告信息](./023-turn-on-warnings.md)
- [指定语言类型](./024-specify-language.md)
- [改变结构体成员的字节对齐](./025-pack-struct.md)
