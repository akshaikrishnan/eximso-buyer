import { ChevronRightIcon, ForwardIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const ListMenu = ({ dept, data, hasSubMenu, menuIndex }: any) => {
  return (
    <li className="relative">
      <Link
        href={data.path}
        className="flex items-center capitalize justify-between py-2 ltr:pl-5  ltr:xl:pl-7  ltr:pr-3 ltr:xl:pr-3.5  rtl:xl:pl-3.5 hover:text-heading hover:bg-gray-200"
      >
        {data.label}
        {data.subMenu && (
          <span className="text-sm mt-0.5 shrink-0">
            <ChevronRightIcon className="text-body w-4 h-4 transition duration-300 ease-in-out group-hover:text-black" />
          </span>
        )}
      </Link>
      {hasSubMenu && (
        <SubMenu dept={dept} data={data.subMenu} menuIndex={menuIndex} />
      )}
    </li>
  );
};

const SubMenu: React.FC<any> = ({ dept, data, menuIndex }) => {
  dept = dept + 1;
  return (
    <ul className="subMenuChild shadow-subMenu bg-gray-50 absolute z-0 ltr:right-full ltr:2xl:right-auto rtl:left-full rtl:2xl:left-auto ltr:2xl:left-full rtl:2xl:right-full opacity-0 invisible top-4 w-56 py-3">
      {data?.map((menu: any, index: number) => {
        const menuName: string = `sidebar-submenu-${dept}-${menuIndex}-${index}`;

        return (
          <ListMenu
            dept={dept}
            data={menu}
            hasSubMenu={menu.subMenu}
            menuName={menuName}
            key={menuName}
            menuIndex={index}
          />
        );
      })}
    </ul>
  );
};

export default ListMenu;
