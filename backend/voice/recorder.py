import os
import queue
import tempfile

import sounddevice as sd
import soundfile as sf
import numpy as np


def record_audio():

    os.makedirs("voice_recordings", exist_ok=True)

    samplerate = 16000
    channels = 1

    silence_threshold = 0.01
    silence_duration = 2.0
    min_recording_duration = 2.5
    max_recording_duration = 30

    audio_queue = queue.Queue()

    recording = []

    silence_counter = 0

    print("\nRecording... Speak now.\n")

    def callback(indata, frames, time, status):

        if status:
            print(status)

        audio_queue.put(indata.copy())

    try:

        with sd.InputStream(
            samplerate=samplerate,
            channels=channels,
            callback=callback,
        ):

            total_duration = 0

            while True:

                chunk = audio_queue.get()

                recording.append(chunk)

                volume = np.linalg.norm(chunk) / len(chunk)

                chunk_duration = len(chunk) / samplerate

                total_duration += chunk_duration

                # Detect silence
                if volume < silence_threshold:
                    silence_counter += chunk_duration
                else:
                    silence_counter = 0

                # Stop after silence
                if (
                    total_duration > min_recording_duration
                    and silence_counter >= silence_duration
                ):
                    break

                # Safety max duration
                if total_duration >= max_recording_duration:
                    break

        print("Recording complete.\n")

        audio_data = np.concatenate(recording, axis=0)

        filename = tempfile.mktemp(
            suffix=".wav",
            dir="voice_recordings",
        )

        sf.write(
            filename,
            audio_data,
            samplerate,
        )

        return filename

    except Exception as e:

        print("Recording failed:", e)

        return None
