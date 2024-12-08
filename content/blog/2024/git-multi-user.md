---
date: 2024-08-08
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

