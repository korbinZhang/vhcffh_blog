---
date: 2023-08-28
tags: ["Linux", "UART", "Serial"]
---

# Linux 串口挂载失败

Ubuntu 插上 CH340 的 usb 转串口后，使用`lsmod`查看 ch341 驱动正常加载，`lsusb`也可以看到 usb 已经正常加载，但是没有`/dev/ttyUSB0`

查看系统 log

```
kernel: usb 1-3: new full-speed USB device number 5 using ohci-pci
kernel: usb 1-3: New USB device found, idVendor=1a86, idProduct=7523, bcdDevice= 2.64
kernel: usb 1-3: New USB device strings: Mfr=0, Product=2, SerialNumber=0
kernel: usb 1-3: Product: USB Serial
kernel: ch341 1-3:1.0: ch341-uart converter detected
kernel: usb 1-3: ch341-uart converter now attached to ttyUSB0
mtp-probe[54666]: checking bus 1, device 5: "/sys/devices/pci0000:00/0000:00:06.0/usb1/1-3"
mtp-probe[54666]: bus: 1, device: 5 was not an MTP device
snapd[766]: udevmon.go:149: udev event error: Unable to parse uevent, err: cannot parse libudev event: invalid env data
systemd[1]: Starting Braille Device Support...
systemd-udevd[54665]: ttyUSB0: Conflicting device node '/dev/ttyUSB0' found, link to '/dev/ttyUSB0' will not be created.
snapd[766]: hotplug.go:200: hotplug device add event ignored, enable experimental.hotplug
brltty[54669]: BRLTTY 6.4 rev BRLTTY-6.4 [https://brltty.app/]
brltty[54669]: BRLTTY 6.4 rev BRLTTY-6.4 [https://brltty.app/]
brltty[54669]: executing as the invoking user: root
brltty[54669]: brltty: executing as the invoking user: root
mtp-probe[54678]: checking bus 1, device 5: "/sys/devices/pci0000:00/0000:00:06.0/usb1/1-3"
mtp-probe[54678]: bus: 1, device: 5 was not an MTP device
snapd[766]: udevmon.go:149: udev event error: Unable to parse uevent, err: cannot parse libudev event: invalid env data
brltty[54669]: BrlAPI Server: release 0.8.3
brltty[54669]: brltty: BrlAPI Server: release 0.8.3
systemd[1]: Started Braille Device Support.
brltty[54669]: Linux Screen Driver:
brltty[54669]: brltty: Linux Screen Driver:
kernel: input: BRLTTY 6.4 Linux Screen Driver Keyboard as /devices/virtual/input/input10
brltty[54669]: USB configuration set error 16: 设备或资源忙
brltty[54669]: brltty: USB configuration set error 16: 设备或资源忙
kernel: usb 1-3: usbfs: interface 0 claimed by ch341 while 'brltty' sets config #1
systemd-logind[768]: Watching system buttons on /dev/input/event8 (BRLTTY 6.4 Linux Screen Driver Keyboard)
brltty[54669]: USB interface in use: 0 (ch341)
brltty[54669]: brltty: USB interface in use: 0 (ch341)
ModemManager[964]: <info>  [base-manager] port ttyUSB0 released by device '/sys/devices/pci0000:00/0000:00:06.0/usb1/1-3'
kernel: ch341-uart ttyUSB0: ch341-uart converter now disconnected from ttyUSB0
kernel: ch341 1-3:1.0: device disconnected
ModemManager[964]: <info>  [base-manager] couldn't check support for device '/sys/devices/pci0000:00/0000:00:06.0/usb1/1-3': Operation was cancelled
brltty[54669]: NoSpeech Speech Driver:
brltty[54669]: brltty: NoSpeech Speech Driver:
```

像是程序 brltty 占用了 usb，卸载 brltty 后恢复正常

## 参考

1. [Unable to connect to /dev/ttyUSB0 [Solved] | MySensors Forum](https://forum.mysensors.org/topic/8871/unable-to-connect-to-dev-ttyusb0-solved)
2. [drivers - /dev/ttyUSB0 not present in Ubuntu 22.04 - Ask Ubuntu](https://askubuntu.com/questions/1403705/dev-ttyusb0-not-present-in-ubuntu-22-04)
