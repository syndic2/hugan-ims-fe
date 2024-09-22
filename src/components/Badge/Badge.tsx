import React from "react";

interface BadgeProps {
  label: string;
  containerClassNames?: string;
}

const Badge: React.FC<BadgeProps> = (props: BadgeProps) => {
  const {
    label,
    containerClassNames
  } = props;

  return (
    <div className={`flex justify-center items-center rounded-md w-fit px-8 py-2 ${containerClassNames && containerClassNames}`}>
      <span className="font-medium text-base text-white">{label}</span>
    </div>
  );
};

export const BadgeMemo = React.memo(Badge);

export default Badge;