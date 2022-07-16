+++
title = "sublime_Text3插入当前时间"
date = 2017-12-21

[taxonomies]
categories = ["软件使用"]
tags = ["sublime"]
+++

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
