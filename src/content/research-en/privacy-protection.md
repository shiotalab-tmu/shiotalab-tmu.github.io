---
title: Privacy Protection
titleEn: Privacy Protection
description: Technologies that prevent a speaker from being identified from their speech while keeping the speech useful for downstream applications. We develop attacks that identify the original speaker from anonymized speech, aiming at reliable evaluation methods.
image: images/im_voice_privacy_en@2x.webp
order: 3
---

## What Is Voice Anonymization?

A voice conveys not only what was said, but also who said it. Speech is further known to reveal speaker attributes such as gender, age, emotion, and health condition.

For this reason, there are situations in which we publish, share, or store speech without wanting to disclose who is speaking, or without wanting personal attributes to be inferred. Voice anonymization is a technology for removing speaker information from speech in such situations, and it is expected to find a wide range of applications.

## How Voice Anonymization Works

A voice anonymization system converts input speech into speech that sounds as if a different person were saying the same thing.

Two properties are required here. One is **the strength of privacy protection**, meaning that the original speaker cannot be traced from the converted speech; the other is that the converted speech remains **useful** for a variety of purposes.

### Evaluating the Performance

To evaluate the privacy protection performance of a voice anonymization system, one has to actually test whether the original speaker can be identified from the anonymized speech. This evaluation applies the technology of [Speaker Verification](/en/research/speaker-verification/), which judges whose voice a given utterance is. By running speaker verification on anonymized speech and measuring how well the original speaker can be identified, we can confirm how effectively the anonymization is working.

## Our Research

Evaluating the privacy protection performance of a voice anonymization system in a reliable way requires developing attacks that identify the original speaker from anonymized speech more accurately. If the attacking side is not strong enough, speech that is in fact unprotected may be mistaken for safe.

Technologies that "protect" and technologies that "reveal" the individuality of a voice are two sides of the same coin. Together with [Speaker Verification](/en/research/speaker-verification/), our laboratory studies evaluation methods for voice anonymization, aiming at the realization of secure voice anonymization systems.
