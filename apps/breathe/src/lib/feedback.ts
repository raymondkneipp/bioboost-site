export type FeedbackMode = "sound" | "haptic" | "none"

let audioInstance: HTMLAudioElement | null = null

function getAudio(): HTMLAudioElement {
  if (!audioInstance) {
    audioInstance = new Audio("/sounds/stage-change.mp3")
    audioInstance.volume = 0.5
  }
  return audioInstance
}

async function triggerSoundFeedback(): Promise<void> {
  try {
    const audio = getAudio()
    audio.currentTime = 0
    await audio.play()
  } catch {
    // Audio play may be blocked by browser autoplay policies
  }
}

async function triggerHapticFeedback(
  trigger: ((input: string) => Promise<void>) | null,
): Promise<void> {
  if (trigger) {
    try {
      await trigger("nudge")
    } catch {
      // Haptic API may not be supported
    }
  }
}

export async function triggerFeedback(
  mode: FeedbackMode,
  hapticTrigger: ((input: string) => Promise<void>) | null,
): Promise<void> {
  switch (mode) {
    case "sound":
      await triggerSoundFeedback()
      break
    case "haptic":
      await triggerHapticFeedback(hapticTrigger)
      break
    case "none":
      break
  }
}
