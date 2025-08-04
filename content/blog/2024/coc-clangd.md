---
date: 2021-11-21
description: 本文解决了Vim中Coc-Clangd因头文件与源文件分离而无法找到头文件的问题。核心方法是在项目根目录创建`compile_commands.json`或`compile_flags.txt`文件，并介绍了如何分别使用CMake和Bear（配合make）来自动生成该配置文件，以确保语言服务器正常工作。
tags: ["Vim", "Coc", "Clangd"]
---

# Coc-Clangd 配置

使用 vim 进行 c 项目开发时，使用 Coc-Clangd 作为语言服务器实现自动补全。当对项目结构进行调整后（.h 和.c 文件分离到了不同的目录），Coc-Clangd 需要一定的配置才能找到相关的.h 文件，否则会出现错误：

```
'*.h' file not found
[clang: pp_file_not_found]
```

具体需要在项目根目录生成`compile_commands.json`文件或者`compile_flags.txt`文件：

1.  当使用 cMake 时，可以运行`cmake -DCMAKE_EXPORT_COMPILE_COMMANDS=1`生成`compile_commands.json`。
2.  当使用 make 时，需要安装[Bear](https://github.com/rizsotto/Bear)（apt 等包管理即可安装）。运行`make clean && bear make`即可生成`compile_commands.json`。
3.  对于其它情况（只使用 clang，没有构建工具和 make）时。可以创建`compile_flags.txt`文件[参考 2](https://releases.llvm.org/8.0.0/tools/clang/tools/extra/docs/clangd/Installation.html#compile-flags-txt)进行相关配置。

## 参考

1.  [ProgrammAbel (u/ProgrammAbel) - Reddit](https://www.reddit.com/r/vim/comments/hrfm1q/cocvim_cocclangd_setup_help/)
2.  [Getting started with clangd --- Extra Clang Tools 8 documentation (llvm.org)](https://releases.llvm.org/8.0.0/tools/clang/tools/extra/docs/clangd/Installation.html)

