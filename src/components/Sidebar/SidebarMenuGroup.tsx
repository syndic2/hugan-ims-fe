import { ReactNode, useState } from 'react';

interface SidebarMenuGroupProps {
  children: (handleClick: () => void, open: boolean) => ReactNode;
  activeCondition: boolean;
}

const SidebarMenuGroup: React.FC<SidebarMenuGroupProps> = (props: SidebarMenuGroupProps) => {
  const {
    children,
    activeCondition
  } = props;

  const [open, setOpen] = useState<boolean>(activeCondition);

  const handleClick = () => {
    setOpen(!open);
  };

  return <li>{children(handleClick, open)}</li>;
};

export default SidebarMenuGroup;
