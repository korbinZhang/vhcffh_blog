---
date: 2024-08-08
description: 本文介绍了在Git中配置多个用户身份的简洁方法。通过在主配置文件`~/.gitconfig`中使用`includeIf`指令，可以根据仓库所在的目录路径，条件性地加载不同的子配置文件，从而为不同工作区自动切换用户名和邮箱。
tags: ["Git", "User", "Config"]
---

# Git配置多个用户

只需要将下面的配置放入到`~/.gitconfig`等文件

```python
# ~/.gitconfig
[user]
    name = korbin
    email = korbin.zhang@outlook.com
[includeIf "gitdif:~/works/"]
    path = ~/.gitconfig-works
[includeIf "gitdif:~/codes/"]
    path = ~/.gitconfig-codes
```

```python
# ~/.gitconfig-works
[user]
    name = Works
    email = works@outlook.com
```

```python
# ~/.gitconfig-codes
[user]
    name = Codes
    email = codes@outlook.com
```

