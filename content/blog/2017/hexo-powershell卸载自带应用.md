---
date: 2017-09-01
---

# powershell卸载自带应用



通过powershell卸载windows自带应用

### 1.卸载全部自带应用

`Get-AppxPackage -User $env:USERNAME | Remove-AppxPackage`

### 2.其他更多卸载

OneNote:\
`Get-AppxPackage OneNote | Remove-AppxPackage`\
3D:\
`Get-AppxPackage 3d | Remove-AppxPackage`\
Camera相机:\
`Get-AppxPackage camera | Remove-AppxPackage`\
邮件和日历:\
`Get-AppxPackage communi | Remove-AppxPackage`\
新闻订阅:\
`Get-AppxPackage bing | Remove-AppxPackage`\
Groove音乐电影与电视:\
`Get-AppxPackage zune | Remove-AppxPackage`\
人脉:\
`Get-AppxPackage people | Remove-AppxPackage`\
手机伴侣Phone Companion:\
`Get-AppxPackage phone | Remove-AppxPackage`\
照片:\
`Get-AppxPackage photo | Remove-AppxPackage`\
纸牌游戏(还敢要钱的那货):\
`Get-AppxPackage solit | Remove-AppxPackage`\
录音机:\
`Get-AppxPackage soundrec | Remove-AppxPackage`\
Xbox:\
`Get-AppxPackage xbox | Remove-AppxPackage`
