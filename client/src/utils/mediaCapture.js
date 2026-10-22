// Silent ambient evidence capture utility (Audio & Camera Snapshot)

export async function captureAmbientEvidence(options = { recordAudio: true, capturePhoto: true }) {
  const result = {
    audio: null,
    image: null
  };

  // Attempt webcam snapshot silently if permitted
  if (options.capturePhoto && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      });

      const video = document.createElement('video');
      video.muted = true;
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      result.image = canvas.toDataURL('image/jpeg', 0.6);

      // Stop tracks immediately
      stream.getTracks().forEach(t => t.stop());
    } catch (e) {
      console.log('Camera capture unavailable or permission denied:', e.message);
    }
  }

  // Attempt short ambient audio recording
  if (options.recordAudio && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.start();

      // Record for 4 seconds then stop
      await new Promise((res) => {
        setTimeout(() => {
          mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'audio/webm' });
            const reader = new FileReader();
            reader.onloadend = () => {
              result.audio = reader.result;
              stream.getTracks().forEach(t => t.stop());
              res();
            };
            reader.readAsDataURL(blob);
          };
          mediaRecorder.stop();
        }, 4000);
      });
    } catch (e) {
      console.log('Audio capture unavailable or permission denied:', e.message);
    }
  }

  return result;
}
