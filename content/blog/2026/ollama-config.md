---
date: 2026-04-24
description: 记录ollama服务配置及问题排查方法。
title: ollama 使用记录
---

1. 修改监听IP

wsl2环境下，ollama安装后默认监听`127.0.0.1`，在docker运行的容器通过`http://host.docker.internal:11434`也无法访问，修改成监听`0.0.0.0`便可以访问了。

通过在服务配置中的增加环境变量`OLLAMA_HOST`进行修改（修改后需要重启服务）:

```txt
...
[Unit]
Description=Ollama Service
After=network-online.target

[Service]
ExecStart=/usr/local/bin/ollama serve
User=ollama
Group=ollama
Restart=always
RestartSec=3
Environment="OLLAMA_HOST=0.0.0.0:11434"

...
```

2. 日志查看

通过`journalctl -u ollama -f`可查看日志信息，环境变量中增加`OLLAMA_DEBUG=1`会输出更详细的日志信息，

## 参考

1. https://docs.ollama.com/
