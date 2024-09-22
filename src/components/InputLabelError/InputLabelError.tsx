import React from 'react';

interface InputLabelErrorProps {
  className?: string;
  error: string;
}

const InputLabelError: React.FC<InputLabelErrorProps> = (props: InputLabelErrorProps) => {
  const {
    className,
    error
  } = props;

  return (
    <span className={`italic text-meta-1 text-sm mt-1.5 ${className ? className : ''}`}>{error}</span>
  );
};

export const InputLabelErrorMemo = React.memo(InputLabelError);

export default InputLabelError;
