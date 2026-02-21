import { useState, useEffect } from 'react';

const useFormatDuration = (duration) => {
  const [formattedDuration, setFormattedDuration] = useState('');

  useEffect(() => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    setFormattedDuration(`${formattedMinutes}:${formattedSeconds}`);
  }, [duration]);

  return formattedDuration;
};

export default useFormatDuration;
