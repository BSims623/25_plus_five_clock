import { useState, useEffect } from 'react'
import './App.css'
import alarm from './alarm.mp3'

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [sessionTime, setSessionTime] = useState(25);
  const [time, setTime] = useState(sessionTime * 6000);
  const [breakTime, setBreakTime] = useState(5);
  const [onBreak, setOnBreak] = useState(false);

  useEffect(() => {
    const alarmAudio = document.getElementById("beep");
    let intervalId;
    if (isRunning) {
      if (time === 0 && !onBreak) {
        playAlarmAudio(alarmAudio)
        setTime(breakTime * 6000);
        setOnBreak(true);
      } else if (time === 0 && onBreak) {
        playAlarmAudio(alarmAudio)
        setTime(sessionTime * 6000);
        setOnBreak(false)
      }
      intervalId = setInterval(() => setTime(time - 100), 1000);
    }
    return () => clearInterval(intervalId)
  }, [isRunning, time])

  const minutes = Math.floor((time % 366000) / 6000);

  const seconds = Math.floor((time % 6000) / 100);

  const handleTime = (id) => {
    if (sessionTime > 1 && id === 'session-decrement' && !isRunning) {
      setSessionTime(prevSessionTime => prevSessionTime - 1);
      setTime(time - 6000);
    } else if (sessionTime < 60 && id === 'session-increment' && !isRunning) {
      setSessionTime(prevSessionTime => prevSessionTime + 1);
      setTime(time + 6000);
    } else if (breakTime > 1 && id === 'break-decrement' && !isRunning) {
      setBreakTime(prevBreakTime => prevBreakTime - 1);
    } else if (breakTime < 60 && id === 'break-increment' && !isRunning) {
      setBreakTime(prevBreakTime => prevBreakTime + 1);
    }
  }

  const handleReset = () => {
    setIsRunning(false);
    setBreakTime(5);
    setSessionTime(25);
    setTime(150000);
    setOnBreak(false)
    const alarmAudioReset = document.getElementById("beep");
    alarmAudioReset.pause();
    alarmAudioReset.currentTime = 0;
  }


  const playAlarmAudio = (props) => {
    props.play();
    setTimeout(() => {
      props.pause()
    }, 3000)
  }

  return (
    <div className='container-flex d-flex flex-column justify-content-center align-items-center bg-dark vh-100'>
      <div className='settings d-flex justify-content-between'>
        <div className="d-flex flex-column align-items-center border border-5 border-danger p-1">
          <h4 id='break-label' className='text-danger'>BREAK LENGTH</h4>
          <div className="break d-flex">
            <div id='break-decrement' className="btn btn-danger me-3" onClick={() => handleTime('break-decrement')}><i className="fa-solid fa-arrow-down"></i></div>
            <h4 id='break-length' className="break-display text-danger">{breakTime}</h4>
            <div id='break-increment' className="btn btn-danger ms-3" onClick={() => handleTime('break-increment')}><i className="fa-sharp fa-solid fa-arrow-up"></i></div>
          </div>
        </div>
        <div className="d-flex flex-column align-items-center border border-5 border-success p-1">
          <h4 id='session-label' className='text-success'>SESSION LENGTH</h4>
          <div className="set d-flex">
            <div id='session-decrement' className="btn btn-success me-3" onClick={() => handleTime('session-decrement')}><i className="fa-solid fa-arrow-down"></i></div>
            <h4 id='session-length' className="break-display text-success">{sessionTime}</h4>
            <div id='session-increment' className="btn btn-success ms-3" onClick={() => handleTime('session-increment')}><i className="fa-sharp fa-solid fa-arrow-up"></i></div>
          </div>
        </div>
      </div>
      <div className="timer-container d-flex flex-column justify-content-center align-items-center rounded-circle py-3 px-5 my-5" style={{ border: onBreak ? 'solid 5px red' : 'solid 5px green' }}>
        <h3 id='timer-label' className="" style={{ color: onBreak ? 'red' : 'green' }}>{onBreak ? 'BREAK' : 'SESSION'}</h3>
        <h1 id='time-left' className="time-display m-0" style={{ color: onBreak ? 'red' : 'green' }}>
          {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </h1>
      </div>
      <div className='main-btns-container d-flex justify-content-between'>
        <div id='start_stop' className="btn" style={{ background: isRunning ? 'red' : 'green' }} onClick={() => setIsRunning(!isRunning)}>{isRunning ? 'Stop' : 'Start'}</div>
        <div id="reset" className="btn btn-primary" onClick={() => handleReset()}>Reset</div>
      </div>
      <audio id='beep' >
        <source src={alarm} />
      </audio>
    </div>
  )
}

export default App
