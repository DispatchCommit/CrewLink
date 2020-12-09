import React, { useContext, useEffect, useState } from 'react'
import { SettingsContext } from './App';

const TestMicrophoneButton: React.FC = () => {
  const [{ microphone }] = useContext(SettingsContext)
  const [error, setError] = useState<boolean>(false)
  const [rms, setRms] = useState<number>(0)

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
  }, [microphone])

  if (error) return <p style={{ fontSize: 12, color: 'red' }}>Could not connect to microphone</p>

  return <div style={{ width: 200, background: '#666', backgroundImage: 'linear-gradient(to right, #666 5px, transparent 1px)', height: 20 }}>
    <div style={{ background: 'green', backgroundImage: 'linear-gradient(to right, green 0%, yellow 80%, red 100%)', backgroundSize: '100% 100%', clipPath: `inset(0 ${Math.ceil(( 1 - rms * 2 ) * 100)}% 0 0)`, width: '100%', height: 20 }} />
  </div>
}

export default TestMicrophoneButton
