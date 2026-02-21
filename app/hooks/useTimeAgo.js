import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function calculateElapsedTime(dateString, t) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return interval > 1 
      ? t('timeAgo.years', { count: interval }) 
      : t('timeAgo.year');
  }
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval > 1 
      ? t('timeAgo.months', { count: interval }) 
      : t('timeAgo.month');
  }
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval > 1 
      ? t('timeAgo.days', { count: interval }) 
      : t('timeAgo.day');
  }
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval > 1 
      ? t('timeAgo.hours', { count: interval }) 
      : t('timeAgo.hour');
  }
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval > 1 
      ? t('timeAgo.minutes', { count: interval }) 
      : t('timeAgo.minute');
  }
  
  return seconds > 1 
    ? t('timeAgo.seconds', { count: Math.floor(seconds) }) 
    : t('timeAgo.second');
}

function useTimeAgo(initialDate) {
  const { t } = useTranslation();
  const [timeAgo, setTimeAgo] = useState(() => calculateElapsedTime(initialDate, t));

  useEffect(() => {
    // Recalculate only when initialDate changes
    setTimeAgo(calculateElapsedTime(initialDate, t));
  }, [initialDate, t]);

  return timeAgo;
}

export default useTimeAgo;
