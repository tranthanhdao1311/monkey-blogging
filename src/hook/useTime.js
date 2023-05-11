import { useEffect } from "react";
import { useState } from "react";

const useTime = (data) => {
  const date = new Date(data?.createAt?.seconds * 1000);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffTime / 60000);
  const diffSeconds = Math.floor(diffTime / 1000);
  const day = Math.floor(diffHours / 24);
  const [time, setTime] = useState();
  const [unit, setUnit] = useState("");

  useEffect(() => {
    if (diffMinutes > 60) {
      setTime(diffHours);
      setUnit("giờ trước");
    } else if (diffMinutes < 60 && diffMinutes > 0) {
      setTime(diffMinutes);
      setUnit("phút trước");
    } else if (diffMinutes === 0) {
      setTime(diffSeconds);
      setUnit("giây trước");
    }

    if (day >= 1) {
      setTime(day);
      setUnit("ngày trước");
    }
  }, [diffMinutes, diffHours, diffSeconds, day]);
  return {
    time,
    unit,
  };
};

export default useTime;
