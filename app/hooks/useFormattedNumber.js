import { useCallback } from 'react';

const useFormattedNumber = () => {
  const formatNumberWithCommas = useCallback((number) => {
    if (typeof number !== 'number') {
      console.warn('Invalid input: Expected a number');
      return '';
    }
    
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }, []);

  return formatNumberWithCommas;
};

export default useFormattedNumber;
