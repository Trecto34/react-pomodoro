import React from "react";
import secondsToMinutes from "../utils/secondsToMinutes";
import "../styles/Pomodoro.css";

interface Props {
  mainTime: number;
}

export default function Timer(props: Props): JSX.Element {
  return <div className="timer">{secondsToMinutes(props.mainTime)}</div>;
}
