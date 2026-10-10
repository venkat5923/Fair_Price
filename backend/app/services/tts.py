import os
import hashlib
from gtts import gTTS
from typing import Dict

AUDIO_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "static", "audio")
os.makedirs(AUDIO_DIR, exist_ok=True)

def generate_voice_payload(text: str, language: str = "te") -> Dict:
    lang_code = "te" if language.lower() in ["te", "telugu"] else ("ta" if language.lower() in ["ta", "tamil"] else "en")
    
    # Generate unique audio hash filename
    hash_object = hashlib.md5((text + lang_code).encode())
    filename = f"speech_{hash_object.hexdigest()[:10]}.mp3"
    filepath = os.path.join(AUDIO_DIR, filename)

    audio_url = f"/static/audio/{filename}"

    if not os.path.exists(filepath):
        try:
            tts = gTTS(text=text, lang=lang_code, slow=False)
            tts.save(filepath)
        except Exception as e:
            # Fallback if gTTS network fails
            audio_url = None

    return {
        "language": lang_code,
        "text_script": text,
        "audio_url": audio_url
    }
