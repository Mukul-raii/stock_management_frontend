import {  useEffect, useState } from "react";

export const useDate = (selectedDate: Date | undefined) => {
  const [date, setDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (selectedDate) {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      const dateWithCurrentTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        hours,
        minutes,
        seconds
      );

      setDate(dateWithCurrentTime);
    }
  }, [selectedDate]);
  return date;
}
