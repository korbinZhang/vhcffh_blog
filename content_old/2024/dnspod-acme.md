---
date: 2024-07-20T02:43:25.744Z
updated: 2024-08-04T04:31:22.322Z
title: 腾讯云自动申请域名证书
slug: dnspod-acme
oid: 669b244db4b3c79fe44e769b
categories: 软件
type: post
permalink: /posts/软件/dnspod-acme
---


## 安装 acme.sh

```bash
curl https://get.acme.sh | sh -s email=my@example.com
```

会将 acme.sh 下载到 `~/.acme.sh/` 中，并且创建一个定时任务：

```bash
# crontab -l
16 2 * * * "/root/.acme.sh"/acme.sh --cron --home "/root/.acme.sh" > /dev/null
```

## 申请证书

通过配置 DNS 的方式可以申请泛域名

在 dnspod 控制台： 我的账号 -> API密钥 -> DNSPod Token -> 创建密钥

配置环境变量，配置创建的密钥

```bash
export DP_Id="**********"
export DP_Key="****************"
```

申请证书，大概1分钟左右，脚本会通过 DNSPod 添加 DNS TXT 记录（申请完成后会自动删除），用于验证域名

并且配置的密钥，会保存起来，用于自动更新

```bash
acme.sh --issue --dns dns_dp -d example.com -d *.example.com
# 更新证书的命令
# acme.sh --renew --dns dns_dp -d example.com -d *.example.com
# 查看证书的命令
# acme.sh --list
```

## 安装证书

acme.sh 会将证书放到指定路径，并重启 nginx

```bash
acme.sh --install-cert -d vhcffh.com \
--key-file       /etc/pki/nginx/private/example.key  \
--fullchain-file /etc/pki/nginx/example.crt \
--reloadcmd     "service nginx force-reload"
```

在 nginx 中配置

```bash
    ssl_certificate "/etc/pki/nginx/example.crt";
    ssl_certificate_key "/etc/pki/nginx/private/example.key";
    ssl_session_cache shared:SSL:1m;
    ssl_session_timeout  10m;
    ssl_ciphers PROFILE=SYSTEM;
    ssl_prefer_server_ciphers on;
```