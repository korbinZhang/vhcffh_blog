---
date: 2019-08-10
tags: ["MathJax", "Hexo"]
---

# mathjax配置问题



使用hexo时，想要实现网页中公式的渲染\
发现不管怎么改，都不能渲染单行公式\
最后发现是在mathjax的2.3版本以后，配置方法变了

mathjax的配置方法

一般网上大部分的mathjax的配置如下
```html
    <script type="text/x-mathjax-config">
      MathJax.Hub.Config({
        tex2jax: {
          inlineMath: [ ['$','$'], ["\\(","\\)"] ],
          processEscapes: true
        }
      });
    </script>
    <script type="text/javascript" src="path-to-MathJax/MathJax.js?config=TeX-AMS_HTML">
    </script>
```
其中配置中这一句主要是增加对单行公式的渲染

    inlineMath: [ ['$','$'], ["\\(","\\)"] ],

有时候会发现无论如修改单行公式总是不能渲染\
原因是在mathjax的2.3版本以后，应该这样配置
```html
    <script type="text/javascript">
      window.MathJax = {
        tex2jax: {
          inlineMath: [ ['$','$'], ["\\(","\\)"] ],
          processEscapes: true
        }
      };
    </script>
    <script type="text/javascript" src="path-to-MathJax/MathJax.js?config=TeX-AMS_HTML">
    </script>
```

对于`hexo`默认转义规则使单行公式显示错误的问题,查看[这篇博客](https://ranmaosong.github.io/2017/11/29/hexo-support-mathjax/)

参考资料

1,<https://docs.mathjax.org/en/latest/configuration.html>
