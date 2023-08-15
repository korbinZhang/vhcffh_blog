+++
template="pages.html"
description="linklocal ipv6与mac相关转换"
+++

# mac 转换 IPv6

<div id="root">
    <style>@import url("style.css")</style>
    <div>
        <input id="ipv6" placeholder="FE80::1034:56FF:FE78:9ABC"></input>
        <button id="ipv6_button">转换为mac</button>
    </div>
    <div>
        <input id="mac" placeholder="12:34:56:78:9A:BC"></input>
        <button id="mac_button">转换为ipv6</button>
    </div>
    <script type="text/javascript"src="scrip.js"></script>
</div>

mac 转换为 linklocal ipv6 流程如下：

1. 取 mac 地址：`12:34:56:78:9A:BC`
2. 在中间插入`FF:FE`：`12:34:56:FE:FE:78:9A:BC`
3. 重新格式化为 IPv6 表示法 `1234:56FF:FE78:9ABC`
4. 将第一个八位字节从十六进制转换为二进制：`12` -> `00010010`
5. 反转索引 6 处的位（从 0 开始计数）：`00010010` -> `00010000`
6. 将八位字节转换回十六进制：`01010000` -> `10`
7. 用新计算的字节替换第一个八位字节：`1034:56FF:FE78:9ABC`
8. 添加链接本地前缀：`FE80::1034:56FF:FE78:9ABC`

<div>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3597458182538053"
         crossorigin="anonymous"></script>
    <ins class="adsbygoogle"
         style="display:block; text-align:center;"
         data-ad-layout="in-article"
         data-ad-format="fluid"
         data-ad-client="ca-pub-3597458182538053"
         data-ad-slot="8311033695"></ins>
    <script>
         (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
</div>
