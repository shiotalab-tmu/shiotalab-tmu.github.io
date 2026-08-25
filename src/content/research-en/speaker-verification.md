---
title: Speaker Verification
titleEn: Speaker Verification
description: A biometric authentication technology that uses voice as biological information to verify whether an input voice belongs to the registered individual. We aim to realize highly accurate and secure speaker verification based on deep learning speaker embeddings.
image: images/im_speaker_verification_en@2x.webp
order: 1
---

## What is Speaker Verification?

Human voice reflects unique individual characteristics, such as physical traits including the shapes of vocal cords and vocal tracts, as well as speaking habits. Speaker Verification is a biometric authentication technology that focuses on this "voice individuality" to determine whether an input voice was uttered by the pre-registered individual.

Because speaker verification can be used touchlessly and remotely with only a microphone, it is expected to find wide applications, such as speaker switching in smart speakers and identity verification in phone calls and call centers.

## Mechanism of Speaker Verification

A speaker verification system mainly consists of two phases: "Enrollment" and "Verification".

**During Enrollment**
Speaker features are extracted from the user's voice and enrolled in the system.

**During Verification**
Speaker features are extracted from the input voice in the same way, and their similarity with the enrolled features is calculated.

**Decision**
If the similarity exceeds a predefined threshold, the user is accepted as the genuine speaker; otherwise, the attempt is rejected as an impostor.

In recent years, methods that use intermediate representations of deep neural networks trained to classify a large number of speakers as speaker embeddings (such as x-vector and ECAPA-TDNN) have become mainstream. With advances in deep learning, verification accuracy has improved dramatically and is said to even exceed human discrimination capabilities under certain conditions.

## Laboratory Initiatives

In our laboratory, we are working on achieving more accurate and robust speaker verification using deep learning-based speaker embeddings. In addition, with the rapid progress of speech synthesis and voice conversion technologies, "spoofing attacks"—which artificially generate voice resembling a target speaker to deceive speaker verification systems—have become a realistic threat. We are analyzing the system's vulnerability against such attacks and researching secure authentication systems combined with [Spoofing Speech Detection](/en/research/spoofing-speech-detection/).
