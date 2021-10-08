---
title: Audio Steganography
author: Deepak
tags: [tech, infosec]
date: "2021-01-08"
thumbnail: ./images/tabo_coll.jpg
description: My checklist for audio steganography challenges in CTFs
---

# Audio steganography checklist
1. Use `exiftool`
2. Use `strings`
3. Use Audacity and check spectrogram. Additional settings
	1. Change spectrogram to logarithmic scale
	2. Change sampling frequency
4. Check for [DTMF tones](http://dialabc.com/sound/detect/index.html)
5. Try QSSTV
6. Check for LSB encryptions
```python
import wave
import struct
wav = wave.open("audio.wav", mode='rb')
frame_bytes = bytearray(list(wav.readframes(wav.getnframes())))
shorts = struct.unpack('H'*(len(frame_bytes)//2), frame_bytes)
# Extract left and right audio streams
extracted_left = shorts[::2] 
extracted_right = shorts[1::2]
extractedLSB = ""
for i in range(0, len(extracted_left)):
    extractedLSB += (str(extracted_left[i] & 1)) if (i%2)==1 else (str(extracted_right[i] & 1))

string_blocks = (extractedLSB[i:i+8] for i in range(0, len(extractedLSB), 8))
decoded = ''.join(chr(int(char, 2)) for char in string_blocks)
print(decoded[:500])
# Search in decoded text
if "ctf" in decoded.lower():
	print("YES")
else:
	print("NO")
wav.close()

```

### Links

1. [LSB](https://github.com/sniperline047/Audio-Steganography)
2. [wav-steg](https://github.com/pavanchhatpar/wav-steg-py)