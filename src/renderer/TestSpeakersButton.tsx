import React, { useContext } from 'react'
import { SettingsContext } from './App';

const TestSpeakersButton = () => {
  const [{ speaker }] = useContext(SettingsContext)

  const audio = new Audio();
  audio.src = "https://downloads.derock.dev/chime.mp3"
  audio.volume = 0.5;

  const testSpeakers = () => {
    if (speaker.toLowerCase() !== 'default')
      (audio as any).setSinkId(speaker)

    audio.currentTime = 0;

    if ( !audio.paused ) {
      audio.pause();
    } else {
      audio.play();
    }
  }

  return <button onClick={testSpeakers}>Test Speaker</button>
}

export default TestSpeakersButton
