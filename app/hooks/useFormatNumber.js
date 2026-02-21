import { useState, useEffect } from 'react';

const useFormatNumber = (number) => {
  const [formattedNumber, setFormattedNumber] = useState('');

  useEffect(() => {
    if (number || number === 0) {
      let formatted = '';
      
      const formatWithSuffix = (num, divisor, suffix) => {
        const rounded = (num / divisor).toFixed(1);
        return rounded.endsWith('.0') ? `${Math.round(num / divisor)}${suffix}` : `${rounded}${suffix}`;
      };

      if (number >= 1000000) {
        formatted = formatWithSuffix(number, 1000000, 'M');
      } else if (number >= 1000) {
        formatted = formatWithSuffix(number, 1000, 'k');
      } else {
        formatted = number.toString();
      }

      setFormattedNumber(formatted);
    }
  }, [number]);

  return formattedNumber;
};

export default useFormatNumber;
