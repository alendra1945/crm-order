import debounce from 'lodash.debounce';
import { useRef } from 'react';

export const useDebounce = (callback: (...args: any[]) => void, delay: number) => {
  const debounceHandler = useRef(debounce(callback, delay)).current;
  return debounceHandler;
};
