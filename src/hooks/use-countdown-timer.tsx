import { useEffect, useState } from "react";

//useCountDownTimer.tsx
const useCountDownTimer = (endDate?: Date) => {
  const [countDown, setCountDown] = useState(
    endDate ? Math.max(0, endDate.getTime() - new Date().getTime()) : 0
  );

  useEffect(() => {
    if (!endDate) return;
    const timer = setInterval(() => {
      setCountDown(Math.max(0, Math.floor(endDate.getTime() - new Date().getTime())));
    }, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  if (!endDate) {
    return "";
  }

  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  const format = (value: number) => value.toString().padStart(2, "0");

  return `${format(days)} days : ${format(hours)} hours : ${format(minutes)} minutes : ${format(seconds)} seconds`;
};

export default useCountDownTimer;
