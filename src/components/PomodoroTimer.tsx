import React, { useEffect, useState, useCallback } from "react";
import useInterval from "../hook/UseInterval";
import Button from "./Button";
import Timer from "./Timer";
import secondsToTime from "../utils/secondsToTime";
import "../styles/Pomodoro.css";

const bellStart = require("../sounds/bellStart.mp3");
const bellFinish = require("../sounds/bellFinish.mp3");

const audioStartWorking = new Audio(bellStart);
const audioStopWorking = new Audio(bellFinish);

interface Props {
  pomodoroTime: number;
  shortRestTime: number;
  longRestTime: number;
  cycles: number;
}

function PomodoroTimer(props: Props): JSX.Element {
  const [mainTime, setMainTime] = useState(props.pomodoroTime);
  const [timeCounting, setTimeCounting] = useState(false);
  const [working, setWorking] = useState(false);
  const [resting, setResting] = useState(false);
  const [cyclesQtdManager, setCyclesQtdManager] = useState(
    new Array(props.cycles - 1).fill(true)
  );
  const [completedCycles, setCompletedCycles] = useState(0);
  const [fullWorkingTime, setFullWorkingTime] = useState(0);
  const [numberOfPomodoros, setNumberOfPomodoros] = useState(0);

  useInterval(
    () => {
      setMainTime(mainTime - 1);
      if (working) setFullWorkingTime(fullWorkingTime + 1);
    },
    timeCounting ? 1000 : null
  );

  const configureWork = useCallback(() => {
    setTimeCounting(true);
    setWorking(true);
    setResting(false);
    setMainTime(props.pomodoroTime);
    audioStartWorking.play();
  }, [
    setTimeCounting,
    setWorking,
    setResting,
    setMainTime,
    props.pomodoroTime,
  ]);

  const configureRest = useCallback(
    (long: boolean) => {
      setTimeCounting(true);
      setWorking(false);
      setResting(true);

      if (long) {
        setMainTime(props.longRestTime);
      } else {
        setMainTime(props.shortRestTime);
      }
      audioStopWorking.play();
    },
    [
      setTimeCounting,
      setWorking,
      setResting,
      setMainTime,
      props.longRestTime,
      props.shortRestTime,
    ]
  );

  useEffect(() => {
    if (working) document.body.classList.add("working");
    if (resting) document.body.classList.remove("working");

    if (mainTime > 0) return;

    if (working && cyclesQtdManager.length > 0) {
      configureRest(false);
      cyclesQtdManager.pop();
    } else if (working && cyclesQtdManager.length <= 0) {
      configureRest(true);
      setCyclesQtdManager(new Array(props.cycles - 1).fill(true));
      setCompletedCycles(completedCycles + 1);
    }

    if (working) setNumberOfPomodoros(numberOfPomodoros + 1);
    if (resting) configureWork();
  }, [
    working,
    resting,
    mainTime,
    cyclesQtdManager,
    numberOfPomodoros,
    completedCycles,
    configureRest,
    setCyclesQtdManager,
    configureWork,
    props.cycles,
  ]);

  return (
    <>
      <div className="pomodoro-container">
        <div className="clock-container">
          <h2 className="working">You're: {working ? "Working" : "Resting"}</h2>
          <Timer mainTime={mainTime} />
        </div>

        <div className="details">
          <p>Completed Cycles: {completedCycles}</p>
          <p>Hours Worked: {secondsToTime(fullWorkingTime)}</p>
          <p>Completed Pomodoros: {numberOfPomodoros}</p>
        </div>

        <div className="controls">
          <Button
            className={!working && !resting ? "hidden" : ""}
            text={timeCounting ? "Pause" : "Play"}
            onClick={() => setTimeCounting(!timeCounting)}
          />
          <Button text="Work" onClick={() => configureWork()} />
          <Button text="Rest" onClick={() => configureRest(false)} />
        </div>

        <div>
          Icon made by{" "}
          <a href="https://www.flaticon.com/authors/baianat" title="Baianat">
            Baianat
          </a>{" "}
          from{" "}
          <a href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
          </a>
        </div>
      </div>
    </>
  );
}

export default PomodoroTimer;
