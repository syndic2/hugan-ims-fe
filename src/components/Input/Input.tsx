import React from "react";
import { FaSearch } from "react-icons/fa";

import { InputLabelMemo } from '../InputLabel/InputLabel';
import { InputLabelErrorMemo } from '../InputLabelError/InputLabelError';

interface InputProps {
  label?: string;
  name?: string;
  type?: 'text' | 'number' | 'password';
  min?: number;
  max?: number;
  maxLength?: number;
  placeholder?: string;
  value?: string | number;
  icon?: React.ReactNode;
  isSearch?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  classNames?: string;
  labelClassname?: string;
  containerClassNames?: string;
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const Input: React.FC<InputProps> = (props: InputProps) => {
  const {
    label,
    name,
    type,
    min,
    max,
    maxLength,
    placeholder,
    isDisabled,
    value,
    icon,
    isSearch,
    isRequired,
    classNames,
    labelClassname,
    containerClassNames,
    handleChange,
    error
  } = props;

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleChange && handleChange(event);
  };

  return (
    <div className={`${containerClassNames ? containerClassNames : 'w-full'} flex flex-col`}>
      {label ? (
        <InputLabelMemo
          label={label}
          className={labelClassname}
          isRequired={isRequired}
        />
      ) : null}
      <div className={`
        relative
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
        {isSearch && isSearch === true ? (
          <FaSearch size={16} />
        ) : null}
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          min={min}
          max={max}
          maxLength={maxLength}
          disabled={isDisabled}
          className={`
          w-full
          h-full
          text-black
           dark:text-white
          border-none
          outline-none
          bg-transparent
          ${classNames ? classNames : ''}
        `}
          value={value}
          onChange={onChange}
        />
        {icon ? icon : null}
      </div>
      {error ? (
        <InputLabelErrorMemo
          error={error}
        />
      ) : null}
    </div>
  );
};

export const InputMemo = React.memo(Input);

export default Input;
