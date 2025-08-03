---
date: 2025-06-01
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
