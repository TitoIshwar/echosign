import { create } from 'zustand'

interface DemoState {
  isWebcamActive: boolean
  detectedSign: string
  generatedSentence: string
  confidence: number
  isListening: boolean
  transcript: { sign: string; sentence: string; time: string }[]
  isSpeaking: boolean
  toggleWebcam: () => void
  setDetectedSign: (sign: string, sentence: string, confidence: number) => void
  toggleListening: () => void
  addToTranscript: (sign: string, sentence: string) => void
  clearTranscript: () => void
  setIsSpeaking: (speaking: boolean) => void
}

export const useDemoStore = create<DemoState>((set) => ({
  isWebcamActive: false,
  detectedSign: 'Waiting...',
  generatedSentence: 'Activate webcam to begin recognition',
  confidence: 0,
  isListening: false,
  transcript: [],
  isSpeaking: false,
  toggleWebcam: () => set((state) => ({ isWebcamActive: !state.isWebcamActive })),
  setDetectedSign: (sign, sentence, confidence) =>
    set({ detectedSign: sign, generatedSentence: sentence, confidence }),
  toggleListening: () => set((state) => ({ isListening: !state.isListening })),
  addToTranscript: (sign, sentence) => {
    const now = new Date()
    const time = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    set((state) => ({
      transcript: [{ sign, sentence, time }, ...state.transcript].slice(0, 20),
    }))
  },
  clearTranscript: () => set({ transcript: [] }),
  setIsSpeaking: (speaking) => set({ isSpeaking: speaking }),
}))
