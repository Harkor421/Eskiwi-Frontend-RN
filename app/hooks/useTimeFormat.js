import { useMemo } from 'react';

const useTimeFormat = (timestamp) => {
  return useMemo(() => {
    if (!timestamp) return '';

    try {
      const date = new Date(timestamp);

      // Helper function to format numbers with leading zeros
      const pad = (num) => (num < 10 ? `0${num}` : num);

      // Get hours and minutes
      let hours = date.getHours();
      const minutes = pad(date.getMinutes());

      // Determine AM or PM
      const period = hours >= 12 ? 'PM' : 'AM';

      // Convert hours to 12-hour format
      hours = hours % 12;
      hours = hours ? hours : 12; // Handle midnight

      // Format the time string
      return `${hours}:${minutes} ${period}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  }, [timestamp]);
};

export default useTimeFormat;
