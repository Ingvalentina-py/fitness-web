// Lectura en voz alta con la voz del propio navegador (Web Speech API).
// No todos los navegadores la traen, así que todo lo de aquí falla en silencio:
// la frase siempre se lee en pantalla, la voz es un extra.

export function canSpeak() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function speak(text, { lang = 'es' } = {}) {
  if (!canSpeak() || !text) return false

  try {
    // Corta lo que estuviera diciendo: nunca se encadenan dos frases
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    window.speechSynthesis.speak(utterance)
    return true
  } catch {
    return false
  }
}

export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel()
}
