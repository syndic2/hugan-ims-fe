import React from "react";

interface ButtonProps {
  label: string;
  icon?: React.ReactNode;
  classNames?: string;
  handleClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  const {
    label,
    icon,
    classNames,
    handleClick
  } = props;

  const onClick = (event: React.MouseEvent<HTMLElement>) => {
    handleClick(event);
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-x-2 w-full rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 ${classNames ? classNames : ''}`}
    >
      {icon}
      {label}
    </button>
  );
};

export const ButtonMemo = React.memo(Button);

export default Button;
