import { NavLink } from 'react-router-dom';

interface SidebarMenuItemProps {
  path: string;
  pathname: string;
  label: string;
  icon?: React.ReactNode;
  isSubMenu?: boolean;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = (props: SidebarMenuItemProps) => {
  const {
    path,
    pathname,
    label,
    icon,
    isSubMenu
  } = props;

  return isSubMenu && isSubMenu === true ? (
    <NavLink
      to={path}
      end
      className={({ isActive }) => {
        return 'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
          (isActive && '!text-white');
      }}
    >
      {label}
    </NavLink>
  ) : (
    <NavLink
      to={path}
      end
      className={`
        group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 
        ${pathname === path && 'bg-graydark dark:bg-meta-4'}
      `}
    >
      {icon}
      {label}
    </NavLink>
  );
};

export default SidebarMenuItem;