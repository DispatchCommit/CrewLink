import React, { useEffect, useState } from 'react';

interface TestMicProps {
	microphone: string;
}

const TestMicrophoneButton: React.FC<TestMicProps> = function ({ microphone } : TestMicProps) {
	const [error, setError] = useState<boolean>(false);
	const [rms, setRms] = useState<number>(0);

  // Local state
  const minUpdateRate = 50;
  let lastRefreshTime = 0;
  let lastRms = 0;

  const handleProcess = (event: AudioProcessingEvent) => {
    // limit update frequency
    if ( event.timeStamp - lastRefreshTime < minUpdateRate ) {
      return;
    }

    // update last refresh time
    lastRefreshTime = event.timeStamp;

    const input = event.inputBuffer.getChannelData(0);
    const total = input.reduce((acc, val) => acc + Math.abs(val), 0);
    const rms = Math.sqrt(total / input.length);
    if ( rms > lastRms ) {
      lastRms = rms;
      setRms(rms);
    } else {
      lastRms -= .02;
      setRms(lastRms);
    }
  }

  useEffect(() => {
    setError(false)

    const ctx = new AudioContext()
    const processor = ctx.createScriptProcessor(2048, 1, 1)
    processor.connect(ctx.destination)

    let removed = false;

    navigator.mediaDevices.getUserMedia({ audio: { deviceId: microphone ?? 'default' } })
      .then((stream) => {
        if ( removed ) return;
        const src = ctx.createMediaStreamSource(stream)
        src.connect(processor)
        processor.addEventListener('audioprocess', handleProcess)
        console.log( `add event listener: ${microphone} ${stream.id}` )
      })
      .catch(() => setError(true))

    return () => {
      removed = true;
      processor.removeEventListener('audioprocess', handleProcess)
      console.log( `remove event listener: ${microphone}` )
    }
  }, [microphone]);

  if (error) return <p style={{ fontSize: 12, color: 'red' }}>Could not connect to microphone</p>

  return <div className="microphone-bar">
    <div className="microphone-bar-inner" style={{ clipPath: `inset(0 ${Math.floor(( 1 - rms * 2 ) * 100)}% 0 0)` }} />
  </div>;
};

export default TestMicrophoneButton;
