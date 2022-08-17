+++
title = "CSS flex 布局"
description = "总结CSS flex布局的一些属性"
date = 2022-08-16

[taxonomies]
categories = ["编程"]
tags = ["CSS"]

[extra]
toc = true

+++
### flex-direction

决定主轴方向
`row`,`row-reverse`,`colum`,`colum-reverse`

### flex-wrap

是否换行
`nowrap`,`wrap`,`wrap-reverse`

### flex-flow

flex-direction属性和flex-wrap属性的简写形式

### justify-content

对齐方式
`flex-start`,`flex-end`,`center`,`space-between`,`space-around`

### align-items

在交叉轴上的对齐方式
`flex-start`,`flex-end`,`center`,`baseline`,`stretch`

### align-content

定义多根轴线的对齐方式
`flex-start`,`flex-end`,`center`,`space-between`,`space-around`,`stretch`

### flex-basis

`flex-basis: number|auto|initial|inherit;`

`flex-basis`设置弹性项目的初始长度。

| 值   | 描述  |
| --- | --- |
| number | 长度单位或百分百，规定弹性项目的初始长度。 |
| auto | 默认值。长度等于弹性项目的长度。如果该项目未规定长度，则长度将依据其内容。 |
| initial | 将此属性设置为其默认值。|
| inherit | 从其父元素继承此属性。 |

### flex-grow

`flex-grow: number|initial|inherit;`
`flex-grow`属性规定在相同的容器中，项目相对于其余弹性项目的增长量。

| 值   | 描述  |
| --- | --- |
| number | 一个数字，规定项目相对于其他灵活的项目进行扩展的量。默认值是 0。 |
| initial | 将此属性设置为其默认值。|
| inherit | 从其父元素继承此属性。 |

### flex-shrink

`flex-shrink: number|initial|inherit;`
`flex-shrink`属性规定当项目溢出时，按比例对所有项目进行空间收缩。

| 值   | 描述  |
| --- | --- |
| number | 一个数字，规定项目相对于其他灵活的项目进行扩展的量。默认值是 0。 |
| initial | 将此属性设置为其默认值。|
| inherit | 从其父元素继承此属性。 |

### 参考

1.[Flex布局语法教程|菜鸟教程](https://www.runoob.com/w3cnote/flex-grammar.html)


