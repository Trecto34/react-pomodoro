import zeroLeft from "./zeroLeft";

export default function secondsToTime(seconds: number): string {
  let hours = zeroLeft(seconds / 3600);
  let min = zeroLeft((seconds / 60) % 60);
  let sec = zeroLeft((seconds % 60) % 60);
  return `${hours}:${min}:${sec}`;
}
