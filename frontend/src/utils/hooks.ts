import { useRef } from "react";

const utilsHooks = {
  useDebouncedCallback: (callback: (...args: any[]) => void, delay: number) => {
    const timer = useRef<NodeJS.Timeout>();
    return (...args: any[]) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => callback(...args), delay);
    };
  },
};

export default utilsHooks;
