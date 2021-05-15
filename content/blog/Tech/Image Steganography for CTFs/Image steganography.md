---
title: Image Steganography
author: Deepak
tags: [tech, infosec]
date: "2021-01-09"
thumbnail: ./images/david-clode.jpg
description: My checklist for image steganography challenges in CTFs
---

# Image steganography checklist
### `file` 
Often the file presented might not be what is apparent from its extension. Unlike windows, Linux doesn't identify file type from its name, but its file header or commonly known as file signature or magic header. For instance, a _jpeg_ image can be renamed as _png_.
```bash
➜  file doh.jpg  
doh.jpg: JPEG image data, JFIF standard 1.01, aspect ratio, density 72x72, segment length 16, baseline, precision 8, 581x600, frames 3
➜  mv doh.jpg doh.png 
➜  file doh.png 
doh.png: JPEG image data, JFIF standard 1.01, aspect ratio, density 72x72, segment length 16, baseline, precision 8, 581x600, frames 3
```

File header of a png file : 

```bash
➜  hexdump -C peter.png | head 
00000000  89 50 4e 47 0d 0a 1a 0a  00 00 00 0d 49 48 44 52  |.PNG........IHDR|
00000010  00 00 03 ca 00 00 03 ca  08 03 00 00 00 7b b1 53  |.............{.S|
00000020  06 00 00 12 0d 7a 54 58  74 52 61 77 20 70 72 6f  |.....zTXtRaw pro|
00000030  66 69 6c 65 20 74 79 70  65 20 65 78 69 66 00 00  |file type exif..|
00000040  78 da ad 9a 6b 96 15 a9  d2 86 ff 33 8a 33 04 82  |x...k......3.3..|
00000050  3b c3 81 08 58 eb cc e0  1b fe 79 22 f7 b6 b4 d4  |;...X.....y"....|
00000060  6e ed af ad 5a ba cb 34  21 21 2e ef 85 ac 70 fe  |n...Z..4!!....p.|
00000070  ef bf 37 fc 87 af 32 53  0a a5 f6 d1 66 6b 91 af  |..7...2S....fk..|
00000080  32 b9 b4 f8 61 c4 d7 d7  eb 53 62 79 fe 7e be 74  |2...a....Sby.~.t|
00000090  c5 fc be fa e9 7a f8 f8  8f c4 25 ff e9 f5 af d8  |.....z....%.....|
```


### `strings` 
A common tool to print the ascii characters in a file. It often reveals embedded comments or metadata.
```bash
➜  strings Save\ Me.mp3 | grep rtcp{
	rtcp{j^cks0n_3ats_r1c3}
```
### `exiftool` 
Reveals image or audio metadata. Often reveals hidden comments.
```bash
➜  exiftool img.jpg 
	ExifTool Version Number         : 10.80
	File Name                       : img.jpg
	Directory                       : .
	File Size                       : 769 bytes
	File Modification Date/Time     : 2020:01:23 04:02:46+05:30
	File Access Date/Time           : 2020:01:23 04:02:57+05:30
	File Inode Change Date/Time     : 2020:01:23 04:02:46+05:30
	File Permissions                : rw-rw-r--
	File Type                       : JPEG
	File Type Extension             : jpg
	MIME Type                       : image/jpeg
	JFIF Version                    : 1.01
	Resolution Unit                 : None
	X Resolution                    : 1
	Y Resolution                    : 1
	Image Width                     : 9
	Image Height                    : 6
	Encoding Process                : Baseline DCT, Huffman coding
	Bits Per Sample                 : 8
	Color Components                : 3
	Y Cb Cr Sub Sampling            : YCbCr4:2:0 (2 2)
	Image Size                      : 9x6
	Megapixels                      : 0.000054
	```
```
### `zsteg` and `jsteg`
zsteg works on png and jsteg works on jpg files. Used to reveal LSB embeddings
```bash
➜  zsteg rev_file.png 
	/usr/lib/ruby/2.5.0/open3.rb:199: warning: Insecure world writable dir /media/epsilon/Playground/Work/IIT/Sem 7/BTP in PATH, mode 040777
	b1,r,lsb,xy         .. text: "r]ve'g~>V@"
	b1,b,lsb,xy         .. file: PGP\011Secret Key -
	b1,rgb,lsb,xy       .. text: "rtcp{^ww3_1_b3l31v3_1n_y0u!}"
```

### `pngcheck` 
Checks the validity of a png file. Often used along with a hex editor like _[hexinator](https://hexinator.com/)_ to fix corrupted png files. Fixes include correcting the file headers or byte checksums.
```bash
➜  pngcheck Mad_Libs.png 
OK: Mad_Libs.png (1089x544, 32-bit RGB+alpha, non-interlaced, 95.2%).
```

### `stegonline` 
This [site](https://stegonline.georgeom.net/upload) has a bunch of tools which allow you to browse through color planes, reveal LSB embeddings or inverse RGB.

### `stegcracker` 
Bruteforce image with a wordlist. An improved utility [stegseek](https://github.com/RickdeJager/stegseek) has replaced stegcracker. 
```bash
➜  stegcracker <file> [<wordlist>]
```

### `steghide` 
Extract information from an image or audio file with a given password. Once a while blank passwords work as well.
```bash
➜  steghide extract -sf <file>
```

### `stegsnow or snow` 
Hides information in text files in form of trailing whitespaces. 
```bash
➜  snow -C <file>
```

### `binwalk` 
Reveals and extracts files embedded in images or audio files. With a known offset, `dd` can be used to extract specific file manually as well.
```bash
➜  binwalk -v <file> # reveals embedded files and their offsets
➜  binwalk -e <file> # extracts embedded files
➜  dd if=<input file> of=<output file> skip=<offset> bs=4M
```

### `foremost` 
Performs a function similar to binwalk
```bash
➜  foremost -v <file>
```