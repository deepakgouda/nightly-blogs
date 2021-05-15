---
title: Volatility Essentials
author: Deepak
tags: [tech, infosec]
date: "2021-01-02"
thumbnail: ./images/hero.jpg
description: Essential commands I use in memory forensics
---

# List of essential Volatility commands

Volatility is an open-source tool which I use for memory analysis. Given a memory dump, volatility can be tagged with numerous extensions to trace processes, get memory dumps, list active network connections, get browser history, analyse command line history or copy clipboard as well.

Here are the essential commands I use often in CTFs.


1. Imageinfo 
	```bash
	volatility -f Win7mem.raw imageinfo
	```
2. Processes
	```bash
	volatility -f Win7mem.raw --profile=Win7SP1x64 pslist
	volatility -f Win7mem.raw --profile=Win7SP1x64 pstree
	volatility -f Win7mem.raw --profile=Win7SP1x64 psxview
	```
3. cmd
	```bash
	volatility -f Win7mem.raw --profile=Win7SP1x64 cmdscan
	volatility -f Win7mem.raw --profile=Win7SP1x64 consoles
	volatility -f Win7mem.raw --profile=Win7SP1x64 cmdline
	```
4. Clipboard
	```bash
	volatility -f Win7mem.raw --profile=Win7SP1x64 clipboard
	```
5. Dumps
	```bash
	volatility -f Win7mem.raw --profile=Win7SP1x64 procdump -p 1976 --dump-dir ./dumps # Process executable
	volatility -f Win7mem.raw --profile=Win7SP1x64 memdump -p 1976 --dump-dir ./dumps # Process addressable memory
	```
	Next, do a `strings` + `grep` for the required keyword on the `.dmp` files.
6. Dump files
	```bash
	volatility -f Win7mem.raw --profile=Win7SP1x64 dumpfiles -D dumps -r evt$ -i -S dumps/summary.txt # -r flag is regex, evt$ for files ending with evt
	```

# Usage in CTFs
I'll also list my solutions to one of the CTFs I've participated in, [Vulncon 2020](https://ctftime.org/event/1149)
The challenges simulate an event where a maleware was sent as an email attachment to the victim. Some time after the attachment was downloaded, the computer crashed. We are provided a memory dump before the crash. 
### Challenge 1: Find the last website visited by the victim along with timestamp
Use chromehistory plugin.	
```bash
volatility --plugins=volatility-plugins --profile=---- -f dump.raw
```
Flag : _vulncon{gamblingsites.org-12-12-2020}_

### Challenge 2: Find the device id of attached USB stick
Use usbstor plugin.
```bash
volatility --plugins=kevthehermit-volatility_plugins/ -f dump.raw --profile=Win7SP1x64 usbstor
```
Flag : _vulncon{68b70eb8-f3fd-5099-907d-4e542601b2c7}_

### Challenge 3: Find the email id from which the mail was sent
It can be observed that the email client used is _mailspring_. So we analyse the memory dump of _mailspring_.
Pid of mailspring is **2596**
```bash
volatility -f dump.raw --profile=Win7SP1x64 memdump -p 2596 --dump-dir ./memdumps
strings 2596.dmp | grep mail | grep ":)" | less
```
Flag : _vulncon{sarojchaudhary581@gmail.com}_

### Links 
1. [Official Doc](https://github.com/volatilityfoundation/volatility/wiki/Command-Reference) 
2. [Cheatsheet](https://digital-forensics.sans.org/media/volatility-memory-forensics-cheat-sheet.pdf)
3. [Source1](https://medium.com/@zemelusa/first-steps-to-volatile-memory-analysis-dcbd4d2d56a1)
4. [DEFCON DFIR](https://medium.com/@melanijan93/write-up-memory-forensics-in-the-def-con-dfir-ctf-c2b50ed62c6b)
5. [Heap inspection](https://reverseengineering.stackexchange.com/questions/16176/volatility-manually-inspect-heap-of-a-process) of a process
6. [BSidesDelhi 2020](https://ctftime.org/writeup/24113)