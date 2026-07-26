---
title: '修复 WSL 网络配置错误 0x8007054f'
date: 2025-11-29
tags: ["WSL", "Network", "Windows"]
---

当 WSL 报错 `createinstance/createvm/configurenetworking/0x8007054f` 并提示无法配置网络时，通常是由于网络服务或系统配置问题导致的。以下是解决此问题的步骤。

```bash
wsl: 出现了内部错误。
错误代码: createinstance/createvm/configurenetworking/0x8007054f
wsl: 无法配置网络 (networkingmode mirrored)，回退到 networkingmode none。
```

## 解决方法

### 重启 HNS 服务

在管理员模式下运行 PowerShell，重启 Host Network Service (HNS) 服务。

```powershell
wsl --shutdown
net stop hns
net start hns
```

### 重置 WSL 网络配置

如果问题仍然存在，可以尝试重置网络堆栈。

```powershell
netsh winsock reset
netsh int ip reset
```

执行后需要重启电脑。

### 完全关闭并重启 WSL

关闭所有 WSL 实例并重新启动服务。

```powershell
wsl --shutdown
wsl -d <你的发行版名称>
```

### 检查 Hyper-V 和相关功能

确保 Windows 功能中的 Hyper-V 和 Virtual Machine Platform 已启用。如果未启用，可以通过以下步骤操作：
1. 打开“控制面板” > “程序” > “启用或关闭 Windows 功能”。
2. 勾选 Hyper-V 和 虚拟机平台，然后重启系统。