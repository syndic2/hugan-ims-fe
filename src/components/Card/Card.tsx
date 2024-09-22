import React from 'react';

interface CardProps {
  containerClassNames?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = (props: CardProps) => {
  const {
    containerClassNames,
    children
  } = props;

  return (
    <div className={`rounded-md border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${containerClassNames ? containerClassNames : ''}`}>
      {children}
    </div>
  );
};

export const CardMemo = React.memo(Card);

export default Card;
