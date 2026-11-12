#!/usr/bin/env bash
# Mixes voice clips (placed at their timeline start), music and SFX into public/audio/mix.m4a
set -euo pipefail
cd "$(dirname "$0")/.."
node scripts/build-timeline.mjs
node scripts/make-audio.mjs
d() { node -e "const t=require('./src/timeline.json');console.log(Math.round(t.segs['$1'].start*1000))"; }
ffmpeg -loglevel error -y \
  -i public/vo/s0.mp3 -i public/vo/s1.mp3 -i public/vo/s2.mp3 -i public/vo/s3.mp3 \
  -i public/vo/s4.mp3 -i public/vo/s5.mp3 -i public/vo/s6.mp3 \
  -i public/audio/music.wav -i public/audio/sfx.wav \
  -filter_complex "
  [0]adelay=$(d s0):all=1[a0];[1]adelay=$(d s1):all=1[a1];[2]adelay=$(d s2):all=1[a2];[3]adelay=$(d s3):all=1[a3];
  [4]adelay=$(d s4):all=1[a4];[5]adelay=$(d s5):all=1[a5];[6]adelay=$(d s6):all=1[a6];
  [a0][a1][a2][a3][a4][a5][a6]amix=inputs=7:normalize=0,aformat=channel_layouts=stereo,
    highpass=f=70,acompressor=threshold=-18dB:ratio=3:attack=5:release=120:makeup=2,volume=1.25[vo];
  [7]volume=0.42[mu];[8]volume=0.5[fx];
  [vo][mu][fx]amix=inputs=3:normalize=0,alimiter=limit=0.89:level=0,apad=whole_dur=40,atrim=0:40[out]" \
  -map "[out]" -ar 48000 -c:a pcm_s16le public/audio/mix.wav
ffmpeg -loglevel info -i public/audio/mix.wav -af ebur128 -f null - 2>&1 | grep -E "I:|LRA:" | tail -2
