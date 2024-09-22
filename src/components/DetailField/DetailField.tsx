import React from 'react';

import { InputLabelMemo } from '../InputLabel/InputLabel';

interface DetailFieldProps {
  label?: string;
  value: string | number;
  className?: string;
}

const DetailField: React.FC<DetailFieldProps> = (props: DetailFieldProps) => {
  const {
    label,
    value,
    className
  } = props;

  return (
    <div className={`flex flex-col ${className ? className : ''}`}>
      {label ? (
        <InputLabelMemo
          label={label}
          className={'!mb-1'}
        />
      ) : null}
      <span className="text-base text-body font-medium">{value}</span>
    </div>
  );
};

export const DetailFieldMemo = React.memo(DetailField);

export default DetailField;
