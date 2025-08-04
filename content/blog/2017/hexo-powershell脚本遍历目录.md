---
date: 2017-09-01
tags: ["Powershell", "Script"]
description: 本文提供了一个实用的PowerShell脚本示例，用于遍历指定目录及其所有子目录，并计算每个子文件夹的总大小。脚本的核心是一个名为`filesize`的自定义函数，该函数接收一个文件路径作为参数，然后利用`dir -Path`和`ForEach-Object`循环遍历目录。对于每个子文件夹，它会通过`dir -Recurse`递归获取所有文件并累加其大小（Length属性），最终以KB为单位输出每个文件夹的名称和计算出的总大小。
---

# powershell脚本遍历目录



powershell脚本遍历目录

### 1.遍历目录及子目录

    function filesize ([string]$filepath) {
        if ($filepath -eq $null) {
            throw "路径不能为空"
        }
        dir -Path $filepath | ForEach-Object -Process {
            if ($_.psiscontainer -eq $true) {
                $length = 0
                dir -Path $_.fullname -Recurse | ForEach-Object {
                    $length += $_.Length
                }
                $l = $length / 1KB
                $_.name + "文件夹的大小为: {0:n1} KB" -f $l
            }
        }
    }
    filesize -filepath "D:\"

### 2.运行示例

    PS F:\python> function filesize ([string]$filepath) {
    >> if ($filepath -eq $null) {
    >> throw "路径不能为空"
    >> }
    >> dir -Path $filepath | ForEach-Object -Process {
    >> if ($_.psiscontainer -eq $true) {
    >> $length = 0
    >> dir -Path $_.fullname -Recurse | ForEach-Object {
    >> $length += $_.Length
    >> }
    >> $l = $length / 1KB
    >> $_.name + "文件夹的大小为: {0:n1} KB" -f $l
    >> }
    >> }
    >> }
    PS F:\python> filesize -filepath "f:\python"
    ipluyou文件夹的大小为: 82,196.5 KB
    loginip_jlu文件夹的大小为: 16.8 KB
    嗅事百科文件夹的大小为: 4.3 KB
    小说文件夹的大小为: 31,043.6 KB
    笑料文件夹的大小为: 1,578,575.8 KB
    PS F:\python>

