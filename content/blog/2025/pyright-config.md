---
date: 2025-06-01
description: 本文介绍了如何配置Pyright类型检查工具以识别非标准目录中的模块。通过在项目根目录创建`pyrightconfig.json`文件，并使用`extraPaths`选项添加额外的包搜索路径，可以解决模块导入时无法找到的问题。
tags: ["Pyright", "Python", "Config"]
---

# pyright 配置

1. 设置额外的包搜索路径

在项目根目录创建文件`pyrightconfig.json`

```json
{
  "extraPaths": ["./src", "./libs", "../shared"]
}
```

"extraPahts" 告诉 pyright 去哪里找你的模块，不在默认路径的模块可以通过这里指定
