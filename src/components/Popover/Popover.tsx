import React from "react";
import useOutsideClick from "../../hooks/useOutsideClick";

interface PopoverProps extends React.PropsWithChildren {
  isOpen: boolean;
  excludeRefElements?: React.RefObject<HTMLElement>[];
  handleOutsideClick?: () => void;
}

const Popover: React.FC<PopoverProps> = (props: PopoverProps) => {
  const {
    isOpen,
    excludeRefElements = [],
    handleOutsideClick,
    children
  } = props;

  const wrapperRef = useOutsideClick(excludeRefElements, () => handleOutsideClick && handleOutsideClick()) as React.RefObject<HTMLDivElement>;

  return (
    <div
      ref={wrapperRef}
      className={`
        ${isOpen ? 'opacity-100 z-20' : 'opacity-0 -z-1'}
        absolute top-15 right-0
        w-max
        rounded
        transition-all ease-in-out duration-300
        bg-white
        drop-shadow-5
        dark:bg-meta-4
    `}>
      <span className="absolute -top-1.5 right-4 -z-10 h-4 w-4 rotate-45 rounded-sm bg-white dark:bg-meta-4"></span>
      {children}
    </div>
  );
};

export const PopoverMemo = React.memo(Popover);

export default Popover;

