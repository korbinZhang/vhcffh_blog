+++
title = "powershell脚本遍历目录"
date = 2017-09-01

[taxonomies]
categories = ["系统"]
tags = ["Windwos", "Powershell"]
+++

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

