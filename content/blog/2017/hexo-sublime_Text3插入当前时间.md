---
date: 2017-12-21
tags: ["Sublime Text", "Plugin"]
description: 本文提供了一个在Sublime Text 3中实现快速插入当前日期和时间功能的详细教程。整个过程分为三步：首先，通过“New Snippet”创建一个代码片段（.sublime-snippet），定义好包含时间占位符的文本模板。其次，通过“New Plugin”创建一个Python插件（.py），编写一个命令来获取当前系统时间并插入。最后，在用户快捷键设置（Key Bindings）中，将这个新创建的命令绑定到一个自定义的快捷键（如alt+t），从而实现一键插入当前时间的功能。
---

# sublime_Text3插入当前时间



sublime\_Text3插入当前时间

1.创建新snippet

tool → new snippet
创建一个新的snippet,并保存为"author.sublime-snippet"(最好在该目录(User)下再创建一个MySnippet目录):\
其内容:

    <snippet>
    <content><![CDATA[
    /**
     * ============================
     * @Author:   XX
     * @Version:  1.0 
     * @DateTime: ${1:alt+t}
     * ============================
     */
    ]]></content>
        <!-- Optional: Set a tabTrigger to define how to trigger the snippet -->
        <tabTrigger>author</tabTrigger>
        <!-- Optional: Set a scope to limit where the snippet will trigger -->
        <!-- <scope>source.python</scope> -->
    </snippet>

2.创建新插件

Tools → New Plugin.
创建时间插件,保存在User目录,命名为addCurrentTime.py:\
其内容为:

    import sublime, sublime_plugin
    import datetime
    class AddCurrentTimeCommand(sublime_plugin.TextCommand):
        def run(self, edit):
            self.view.run_command("insert_snippet", 
                {
                    "contents": "%s" % datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S") 
                }
            )

3.绑定快捷键

Preference → Key Bindings → User.绑定快捷键:

    [
        {
            "command": "add_current_time",
            "keys": [
                "alt+t"
            ]
        }
    ]

其中绑定的命令的名字是由所创建的插件的类名而来\
AddCurrentTimeCommand---\>add\_current\_time\
这应该是Sublime创建插件的规则

参考资料

1,<http://www.cnblogs.com/xiaomingzaixian/p/6984664.html>\
2,<http://blog.csdn.net/sshfl_csdn/article/details/46415551>
