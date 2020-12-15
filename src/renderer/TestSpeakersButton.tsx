import React from 'react';
// @ts-ignore
import chime from '../../static/chime.mp3';
import { ExtendedAudioElement } from './Voice';

interface TestSpeakersProps {
	speaker: string
}

const TestSpeakersButton: React.FC<TestSpeakersProps> = ({ speaker }: TestSpeakersProps) => {
  const [{ speaker }] = useContext(SettingsContext)

  const audio = new Audio() as ExtendedAudioElement;
	audio.src = chime;
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

  return (
		<button className="test-speakers" onClick={testSpeakers}>Test Speaker</button>
	);
}

export default TestSpeakersButton;
