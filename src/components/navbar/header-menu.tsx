import { ChevronDownIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import Link from "next/link";
import ListMenu from "./list-menu";
import MegaMenu from "./mega-menu";

interface MenuProps {
  data: any;
  className?: string;
}

const HeaderMenu: React.FC<MenuProps> = ({ data, className }) => {
  return (
    <nav className={classNames(`headerMenu flex w-full relative`, className)}>
      {data?.map((item: any) => (
        <div
          className={`menuItem group cursor-pointer py-2 ${
            item.subMenu ? "relative" : ""
          }`}
          key={item.id}
        >
          <Link
            href={item.path}
            className="relative capitalize inline-flex items-center px-3 py-2 text-sm font-normal rtl:before:right-0 ltr:before:left-0 xl:text-base text-heading xl:px-4 group-hover:text-black"
          >
            {item.label}
            {(item?.columns || item.subMenu) && (
              <span className="opacity-30 text-xs mt-1 xl:mt-0.5 w-4 flex justify-end">
                <ChevronDownIcon className="transition duration-300 ease-in-out transform group-hover:-rotate-180" />
              </span>
            )}
          </Link>

          {item?.columns && Array.isArray(item.columns) && (
            <MegaMenu columns={item.columns} />
          )}

          {item?.subMenu && Array.isArray(item.subMenu) && (
            <div className="absolute bg-gray-175 opacity-0 subMenu shadow-header ltr:left-0 rtl:right-0 group-hover:opacity-100">
              <ul className="py-5 text-sm text-body">
                {item.subMenu.map((menu: any, index: number) => {
                  const dept: number = 1;
                  const menuName: string = `sidebar-menu-${dept}-${index}`;

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
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};

export default HeaderMenu;
