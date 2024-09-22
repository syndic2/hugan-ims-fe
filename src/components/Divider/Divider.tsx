import React from "react";

interface DividerProps {
  direction: 'HORIZONTAL' | 'VERTICAL';
  classNames?: string;
}

const Divider: React.FC<DividerProps> = (props: DividerProps) => {
  const {
    direction,
    classNames
  } = props;

  return (
    <div className={`border ${direction === 'HORIZONTAL' ? 'w-full h-0' : 'w-0 h-full'} dark:border-bodydark2 ${classNames ? classNames : ''}`}>&nbsp;</div>
  );
};

export const DividerMemo = React.memo(Divider);

export default Divider;
