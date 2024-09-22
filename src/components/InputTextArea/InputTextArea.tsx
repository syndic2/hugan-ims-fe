import React from 'react';

interface InputAreaProps {
  label?: string;
  name?: string;
  placeholder?: string;
  value?: string | number;
  rows?: number;
  isRequired?: boolean;
  classNames?: string;
  handleChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
}

const InputTextArea: React.FC<InputAreaProps> = (props: InputAreaProps) => {
  const {
    label,
    name,
    placeholder,
    value,
    rows,
    isRequired,
    classNames,
    handleChange,
    error
  } = props;

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleChange && handleChange(event);
  };

  return (
    <div className="w-full">
      <label className="mb-2.5 block font-medium text-bodydark2 dark:text-white">
        {label}
        {isRequired && isRequired === true ?
          <span className="text-meta-1 ml-1">*</span> : null
        }
      </label>
      <textarea
        name={name}
        placeholder={placeholder}
        rows={rows}
        className={`
          w-full 
          rounded border-[1.5px] border-stroke 
          bg-transparent 
          py-3 px-5 
          text-black 
          outline-none 
          transition 
          focus:border-primary 
          active:border-primary 
          disabled:cursor-default 
          disabled:bg-whiter 
          dark:border-form-strokedark 
          dark:bg-form-input 
          dark:text-white 
          dark:focus:border-primary
          resize-none
          ${classNames && classNames}
        `}
        value={value}
        onChange={onChange}
      ></textarea>
      {error ? (
        <span className="italic text-red-500 text-sm mt-1">{error}</span>
      ) : null}
    </div>
  );
};

export const InputTextAreaMemo = React.memo(InputTextArea);

export default InputTextArea;