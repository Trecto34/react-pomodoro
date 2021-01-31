import zeroLeft from "./zeroLeft";

export default function secondsToMinutes(seconds: number): string {
  let min = zeroLeft((seconds / 60) % 60);
  let sec = zeroLeft((seconds % 60) % 60);
  return `${min}:${sec}`;
}
