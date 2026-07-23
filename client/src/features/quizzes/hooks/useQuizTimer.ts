import { useState, useEffect, useCallback } from 'react';

export const useQuizTimer = (limitMinutes: number | null, onExpire: () => void) => {
  const [secondsLeft, setSecondsLeft] = useState(limitMinutes ? limitMinutes * 60 : null);

  useEffect(() => {
    if (secondsLeft === null) return;
    if (secondsLeft <= 0) {
      onExpire();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, onExpire]);

  const formatted = useCallback(() => {
    if (secondsLeft === null) return null;
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, [secondsLeft]);

  return { secondsLeft, formattedTime: formatted() };
};