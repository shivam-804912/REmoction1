"""Generate the character voice-over for the PostMCP explainer.

Uses offline Piper (VITS) Hindi voices through sherpa-onnx:
  Shiva -> hi_IN-pratham-medium (male)
  Sheya -> hi_IN-priyamvada-medium (female)

The on-screen script stays in Roman Hinglish (src/script.ts). The TTS reads a
Devanagari phonetic copy of each line, which gives far better pronunciation.

Writes:
  public/voices/NN-<speaker>.wav   one clip per script line
  src/voice-data.json              clip length + per-frame mouth envelope

Usage:
  pip install sherpa-onnx soundfile numpy
  python3 scripts/generate_voices.py --voices-dir /path/to/voices
where the voices dir holds the extracted sherpa-onnx model folders
(vits-piper-hi_IN-pratham-medium, vits-piper-hi_IN-priyamvada-medium) from
https://github.com/k2-fsa/sherpa-onnx/releases/tag/tts-models
"""

import argparse
import json
import math
from pathlib import Path

import numpy as np
import sherpa_onnx
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
FPS = 30

VOICES = {
    "shiva": ("hi_IN-pratham-medium", 1.0),
    "sheya": ("hi_IN-priyamvada-medium", 1.05),
}

# Must stay in the same order as SCRIPT in src/script.ts.
LINES = [
    ("sheya", "शिवा, तुम रोज़ इतने सारे सोशल मीडिया पोस्ट्स कैसे मैनेज कर लेते हो? एक्स, लिंक्डइन, इंस्टाग्राम, इतना सब मैन्युअली कैसे?"),
    ("shiva", "मैं मैन्युअली नहीं करता, शेया. ये देखो, पोस्ट एम सी पी ए आई."),
    ("sheya", "पोस्ट एम सी पी? ये क्या करता है?"),
    ("shiva", "सिंपल है. मैं बस एक आइडिया देता हूँ, जैसे, हमारा न्यू प्रोडक्ट फ्राइडे को लॉन्च हो रहा है. पोस्ट एम सी पी उसी आइडिया को एक्स, लिंक्डइन, इंस्टाग्राम और बाकी प्लैटफ़ॉर्म्स के लिए अलग अलग स्टाइल में रेडी कर देता है."),
    ("sheya", "फिर हर जगह सेपरेटली पोस्ट करना पड़ता है?"),
    ("shiva", "नहीं! अकाउंट्स कनेक्ट करो, पोस्ट्स रिव्यू करो, टाइम सिलेक्ट करो, और शेड्यूल. बस."),
    ("sheya", "वेट, और ये ए आई के साथ भी वर्क करता है?"),
    ("shiva", "एग्ज़ैक्टली! चैट जी पी टी, क्लॉड या कर्सर को पोस्ट एम सी पी से कनेक्ट करो, और सिंपली बोलो, मेरा लॉन्च पोस्ट कल नौ बजे शेड्यूल कर दो. ए आई टूल्स पोस्ट एम सी पी के थ्रू सोशल अकाउंट्स के साथ काम कर सकते हैं."),
    ("sheya", "ओके, सो बेसिकली एक आइडिया, और बाकी का काम पोस्ट एम सी पी?"),
    ("shiva", "एग्ज़ैक्टली. सोशल मीडिया मैनेज करना है, सोशल मीडिया के पीछे भागना नहीं."),
    ("sheya", "ओके शिवा, अब मुझे भी पोस्ट एम सी पी चाहिए!"),
    ("shiva", "देन यू नो व्हेयर टु स्टार्ट, पोस्ट एम सी पी ए आई."),
]


def load_tts(voices_dir: Path, name: str) -> sherpa_onnx.OfflineTts:
    d = voices_dir / f"vits-piper-{name}"
    cfg = sherpa_onnx.OfflineTtsConfig(
        model=sherpa_onnx.OfflineTtsModelConfig(
            vits=sherpa_onnx.OfflineTtsVitsModelConfig(
                model=str(d / f"{name}.onnx"),
                tokens=str(d / "tokens.txt"),
                data_dir=str(d / "espeak-ng-data"),
            ),
            num_threads=4,
        )
    )
    return sherpa_onnx.OfflineTts(cfg)


def trim_silence(x: np.ndarray, sr: int, thresh: float = 0.01) -> np.ndarray:
    loud = np.where(np.abs(x) > thresh)[0]
    if len(loud) == 0:
        return x
    pad = int(0.05 * sr)
    return x[max(0, loud[0] - pad) : min(len(x), loud[-1] + pad)]


def mouth_envelope(x: np.ndarray, sr: int) -> str:
    """Per-video-frame loudness, quantised to digits 0-9."""
    hop = sr / FPS
    frames = math.ceil(len(x) / hop)
    rms = np.array([np.sqrt(np.mean(x[int(i * hop) : int((i + 1) * hop)] ** 2) + 1e-12) for i in range(frames)])
    level = np.clip(rms / (np.percentile(rms, 95) + 1e-9), 0, 1)
    return "".join(str(int(round(v * 9))) for v in level)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--voices-dir", type=Path, required=True)
    args = parser.parse_args()

    out_dir = ROOT / "public" / "voices"
    out_dir.mkdir(parents=True, exist_ok=True)
    engines = {who: load_tts(args.voices_dir, name) for who, (name, _) in VOICES.items()}

    data = []
    for i, (who, text) in enumerate(LINES):
        audio = engines[who].generate(text, sid=0, speed=VOICES[who][1])
        sr = audio.sample_rate
        x = trim_silence(np.asarray(audio.samples, dtype=np.float32), sr)
        x = x / (np.max(np.abs(x)) + 1e-9) * 0.89  # peak-normalise to about -1 dBFS
        name = f"{i + 1:02d}-{who}.wav"
        sf.write(out_dir / name, x, sr, subtype="PCM_16")
        env = mouth_envelope(x, sr)
        data.append({"file": f"voices/{name}", "frames": len(env), "envelope": env})
        print(f"{name}: {len(x) / sr:.2f}s")

    (ROOT / "src" / "voice-data.json").write_text(json.dumps(data, indent=1, ensure_ascii=False) + "\n")


if __name__ == "__main__":
    main()
