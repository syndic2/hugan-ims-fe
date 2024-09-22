import React from 'react';
import ReactSelect, { Props as ReactSelectProps } from 'react-select';

import { InputLabelMemo } from '../InputLabel/InputLabel';
import { InputLabelErrorMemo } from '../InputLabelError/InputLabelError';

interface SelectProps extends ReactSelectProps<any> {
  label?: string;
  isRequired?: boolean;
  error?: string;
  containerClassName?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  isRequired,
  error,
  containerClassName,
  ...props
}) => {
  return (
    <div className={`flex flex-col ${containerClassName ? containerClassName : ''}`}>
      {label ? (
        <InputLabelMemo
          label={label}
          isRequired={isRequired}
        />
      ) : null}
      <ReactSelect {...props} />
      {error ? (
        <InputLabelErrorMemo
          error={error}
        />
      ) : null}
    </div>
  );
};

export const SelectMemo = React.memo(Select);

export default Select;
