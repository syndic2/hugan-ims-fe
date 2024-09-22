import React, { useState, useEffect } from "react";

import { numericFormat } from '../../commons/helpers';
import { InputLabelMemo } from '../InputLabel/InputLabel';
import { InputLabelErrorMemo } from '../InputLabelError/InputLabelError';

interface InputNumberProps {
  label?: string;
  name?: string;
  min?: number;
  max?: number;
  placeholder?: string;
  value?: number;
  isRequired?: boolean;
  isDisabled?: boolean;
  className?: string;
  containerClassName?: string;
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const InputNumber: React.FC<InputNumberProps> = (props: InputNumberProps) => {
  const {
    label,
    name,
    min,
    max,
    placeholder,
    isDisabled,
    value,
    isRequired,
    className,
    containerClassName,
    handleChange,
    error
  } = props;

  const [displayValue, setDisplayValue] = useState<string>();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let actualValue = Number(event.target.value.replace(/[^0-9]/g, ''));

    if (min && actualValue < min) actualValue = min;
    if (max && actualValue > max) actualValue = max;

    if (value === undefined) setDisplayValue(numericFormat(actualValue));
    handleChange && handleChange({
      ...event,
      target: {
        ...event.target,
        name: event.target.name,
        value: actualValue.toString()
      }
    });
  };

  useEffect(() => {
    if (value !== undefined) setDisplayValue(numericFormat(value));
  }, [value]);

  return (
    <div className={`${containerClassName ? containerClassName : 'w-full'} flex flex-col`}>
      {label ? (
        <InputLabelMemo
          label={label}
          isRequired={isRequired}
        />
      ) : null}
      <div className={`
        flex items-center gap-x-3
        transition
      focus-within:border-primary
        rounded border-[1.5px] border-stroke
        bg-transparent
        py-3 px-5
        disabled-within:cursor-default
        disabled-within:bg-whiter
        dark:border-form-strokedark
        dark:bg-form-input
        dark:focus-within:border-primary
        ${isDisabled ? `
          disabled-within:bg-slate-50
          disabled-within:text-slate-500
          disabled-within:border-slate-200
          disabled-within:shadow-none
          dark:disabled-within:bg-bodydark2
        ` : ''}
      `}>
        <input
          name={name}
          placeholder={placeholder}
          min={min}
          max={max}
          disabled={isDisabled}
          className={`
          w-full
          h-full
          text-black
           dark:text-white
          border-none
          outline-none
          bg-transparent
          ${className ? className : ''}
        `}
          value={displayValue}
          onChange={onChange}
        />
      </div>
      {error ? (
        <InputLabelErrorMemo
          error={error}
        />
      ) : null}
    </div>
  );
};

export const InputNumberMemo = React.memo(InputNumber);

export default InputNumber;
