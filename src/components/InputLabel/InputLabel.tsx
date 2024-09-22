import React from 'react';

interface InputLabelProps {
  label: string;
  isRequired?: boolean;
  className?: string;
}

const InputLabel: React.FC<InputLabelProps> = (props: InputLabelProps) => {
  const {
    label,
    isRequired,
    className
  } = props;

  return (
    <label className={`mb-2.5 block font-medium text-bodydark2 dark:text-white ${className ? className : ''}`}>
      {label}
      {isRequired && isRequired === true ?
        <span className="text-sm text-meta-1 ml-1">*required</span> : null
      }
    </label>
  );
};

export const InputLabelMemo = React.memo(InputLabel);

export default InputLabel;
