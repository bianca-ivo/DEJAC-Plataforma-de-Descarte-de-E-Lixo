let isSpeaking = false;
let currentSpeech;

export const speakText = (text) => {
  if (isSpeaking) {
    window.speechSynthesis.cancel(); // Corrigido
  }

  isSpeaking = true;
  currentSpeech = new SpeechSynthesisUtterance(text);

  currentSpeech.onend = () => {
    isSpeaking = false;
  };

  window.speechSynthesis.speak(currentSpeech);
};

export const stopSpeaking = () => {
  if (isSpeaking) {
    window.speechSynthesis.cancel();
    isSpeaking = false;
  }
};
