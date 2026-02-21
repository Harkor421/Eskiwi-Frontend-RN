import { useState, useEffect } from 'react';

const useDateFormat = (dateString) => {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    if (dateString) {
      const date = new Date(dateString);

      // Extract day, month, and year
      const day = date.getDate().toString().padStart(2, '0'); // Ensure 2 digits
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
      const year = date.getFullYear();

      // Construct the formatted date string
      const formatted = `${day}/${month}/${year}`;

      setFormattedDate(formatted);
    }
  }, [dateString]);

  return formattedDate;
};

export default useDateFormat;
