/* globals process, TIMINGSRC */
import React, { useEffect, useState, useRef } from 'react'

export default function Sequencer() {
  const intervals = useRef([])
  const timer = useRef([0])
  const player = useRef()
  const sequencer = useRef()
  const timingObject = useRef()
  const [src, setSrc] = useState(null)
  const [files, setFiles] = useState([])
  const [duration, setDuration] = useState([])
  
  useEffect(() => {
    if (!process.browser) return null
    
    timingObject.current = new TIMINGSRC.TimingObject({ range: [0, 52] })
    sequencer.current = new TIMINGSRC.Sequencer(timingObject.current)

    const change = e => setSrc(e.data)
    const remove = () => setSrc('')
    sequencer.current.on('change', change)
    sequencer.current.on('remove', remove)
  }, [])

  useEffect(() => {
    return () => {
      files.forEach(url => {
        URL.revokeObjectURL(url)
      });
    }
  }, [])

  useEffect(() => {
    if (!files.length) return
    player.current.load()
    timingObject.current.vector.velocity > 0 && src && player.current.play()
  }, [src])

  const onPlay = () => {
    timingObject.current.update({ velocity: 1.0 })
    timer.current[1] = setInterval(() => {
      console.log(++timer.current[0])
    }, 1000);
  }

  const onPause = () => {
    timingObject.current.update({ velocity: 0.0 })
    clearInterval(timer.current[1])
    !player.current.paused && player.current.pause()
  }
  
  const onReset = () => {
    timingObject.current.update({ position: 0.0, velocity: 0.0 })
    clearInterval(timer.current[1])
    timer.current[0] = 0
    player.current.load()
  }

  const handleFile = (e) => {
    if (!e.target.files[0]) return
    files[e.target.id] = URL.createObjectURL(e.target.files[0])
    setFiles([...files])
  }

  const handleDuration = e => {
    duration[e.target.id] = parseInt(e.target.value)
    setDuration([...duration])
  }
  
  const setCues = () => {
    duration.forEach((time, index) => {
      const start = intervals.current[index - 1]?.end ?? 1
      const end = start + (time || 5) + 1
      intervals.current[index] = {
        start, end
      }
      sequencer.current.addCue(`${index}`, new TIMINGSRC.Interval(start, end), files[index])
    });
    onPause()
  }

  return (
    <div>
      <button onClick={onPlay}>Play/Resume</button>
      <button onClick={onPause}>Pause</button>
      <button onClick={onReset}>Reset</button>
      <div>
        <input id={0} onChange={handleFile} type="file" accept="video/*" />
        <input id={0} type="number" onChange={handleDuration} placeholder="duration" />
      </div>
      <div>
        <input id={1} onChange={handleFile} type="file" accept="video/*" />
        <input id={1} type="number" onChange={handleDuration} placeholder="duration" />
      </div>
      <div>
        <input id={2} onChange={handleFile} type="file" accept="video/*" />
        <input id={2} type="number" onChange={handleDuration} placeholder="duration" />
      </div>
      <div>
        <button onClick={setCues}>Set Timeline</button>
      </div>
      <video width={500} ref={player} controls onPlaying={() => !timer.current[1] && onPlay()} onPause={onPause}>
        <source src={src} type="video/mp4"></source>
      </video>
    </div>
  )
}
