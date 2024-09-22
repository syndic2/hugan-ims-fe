import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";

interface BackButtonProps {
  path: string;
  label?: string;
  handleClick?: () => void;
}

const BackButton: React.FC<BackButtonProps> = (props: BackButtonProps) => {
  const navigate = useNavigate();

  const {
    path,
    label,
    handleClick
  } = props;

  const onBackClick = () => {
    navigate(path);
    handleClick && handleClick();
  };

  return (
    <div className="flex items-center gap-x-4">
      <FaArrowLeft
        size={16}
        onClick={onBackClick}
        className='cursor-pointer'
      />
      {label ? (
        <span className='font-medium text-title-xsm'>{label}</span>
      ) : null}
    </div>
  );
};

export const BackButtonMemo = React.memo(BackButton);

export default BackButton;
