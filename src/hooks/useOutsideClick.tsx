import { useRef, useEffect } from "react";

const useOutsideClick = (excludeRefElements: React.RefObject<HTMLElement>[], callback?: any) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent | TouchEvent) => {
      const isExcludes = excludeRefElements.every(item => !(item.current && item.current?.contains(event.target as Node)));

      if (ref.current && !ref.current.contains(event.target as Node) && isExcludes) {
        callback && callback();
      }
    };

    document.addEventListener('mouseup', handleClick);
    document.addEventListener('touchend', handleClick);

    return () => {
      document.removeEventListener('mouseup', handleClick);
      document.removeEventListener('touchend', handleClick);
    };
  }, []);

  return ref;
};

export default useOutsideClick;