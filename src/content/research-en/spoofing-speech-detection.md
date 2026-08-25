---
title: Spoofing Speech Detection
titleEn: Spoofing Speech Detection
description: A technology for determining whether input speech was actually produced by a human. We are developing robust spoofed-speech detection models using deep learning and speech signal processing, including database construction.
image: images/im_spoofing_detection_en@2x.webp
order: 2
---

## What is Spoofing Speech Detection?

With the development of speech synthesis and generative AI technologies, it has become easy to create speech that resembles a particular person's voice. Such spoofed speech can be used to spread false information by imitating a public figure's voice, making it increasingly important to determine whether speech is genuine or spoofed. Spoofing speech detection is a technology for determining whether input speech was actually uttered by a human.

## How Spoofing Speech Detection Works

A spoofing speech detection system extracts features from input speech and uses a classification model to determine whether it is human speech or an attack using spoofed speech.

Spoofing attacks can be broadly divided into replay attacks and synthetic speech attacks.

**Replay attacks**

An attacker records a person's voice with a microphone and plays the recording through a speaker or another playback device to bypass the system.

**Synthetic speech attacks**

These attacks use synthetic speech generated through text-to-speech or voice-conversion technologies to fabricate an utterance that the target speaker did not actually produce.

In recent years, methods that use deep neural networks to learn a wide range of speech characteristics have become mainstream for countering both types of attack. At the same time, detection systems must also handle unknown generation methods, high-performance playback devices, and differences in compression and communication channels.

## Laboratory Initiatives

Our laboratory is developing robust spoofing speech detection models using deep learning and speech signal processing. In particular, we study database construction and detection methods that incorporate spatial information.
