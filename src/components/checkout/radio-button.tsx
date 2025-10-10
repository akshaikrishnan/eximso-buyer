import { RadioGroup, Label, Radio, Description } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import Image from "next/image";
import { ReactNode } from "react";
import { Price } from "../common/price";

export interface RadioItem {
  _id: string | number;
  title: string;
  icon?: string;
  description?: string;
  subtitle?: string;
  [key: string]: any; // Allow additional properties
}

interface RadioSelectorProps<T extends RadioItem> {
  items: T[];
  selectedItem: T | null;
  onChange: (item: T) => void;
  label?: ReactNode;
  className?: string;
  isGrid?: boolean;
}

export default function RadioSelector<T extends RadioItem>({
  items,
  selectedItem,
  onChange,
  label,
  className,
  isGrid = false,
}: RadioSelectorProps<T>) {
  return (
    <RadioGroup
      value={selectedItem}
      onChange={onChange}
      className={className}
      key={selectedItem?._id}
    >
      {label && (
        <Label className="text-base font-medium text-gray-900">{label}</Label>
      )}

      <div
        className={clsx(
          "mt-4 grid grid-cols-1 gap-y-6  sm:gap-x-4",
          isGrid ? "sm:grid-cols-3" : ""
        )}
      >
        {items
          .sort((item) => (item.isActive ? -1 : 1))
          .map((item) => (
            <Radio
              key={item._id}
              value={item}
              disabled={!item.isActive}
              className={({ checked, disabled }) =>
                clsx(
                  checked
                    ? "border-transparent ring-2 ring-indigo-500"
                    : "border-gray-300",
                  disabled ? "opacity-50" : "",
                  "relative bg-white border rounded-lg shadow-xs p-4 flex cursor-pointer focus:outline-hidden"
                )
              }
            >
              {({ checked, disabled }) => (
                <>
                  <div className="flex-1 flex">
                    <div className="flex flex-col">
                      {(item.icon || item.image) && (
                        <Image
                          src={item.icon || item.image}
                          alt={item.title || item.name}
                          width={50}
                          height={50}
                          className="w-12 h-12 rounded-full"
                        />
                      )}
                      <Label
                        as="span"
                        className="block text-sm font-medium text-gray-900 mt-3"
                      >
                        {item.title}
                      </Label>
                      {item.description && (
                        <Description
                          as="span"
                          className="mt-1 flex items-center text-sm text-gray-500"
                        >
                          {item.description}
                        </Description>
                      )}
                      {item.subtitle && (
                        <Description
                          as="span"
                          className="mt-6 text-sm font-medium text-gray-900"
                        >
                          {item.subtitle}
                        </Description>
                      )}
                      {item.price && (
                        <Description
                          as="span"
                          className="mt-6 text-sm font-medium text-gray-900"
                        >
                          <Price amount={item.price} />
                        </Description>
                      )}
                    </div>
                  </div>
                  <CheckCircleIcon
                    className={clsx(
                      !checked ? "invisible" : "",
                      "h-5 w-5 text-indigo-600"
                    )}
                    aria-hidden="true"
                  />
                  <div
                    className={clsx(
                      checked
                        ? "border-indigo-500 border"
                        : "border-transparent border-2",
                      "absolute -inset-px rounded-lg pointer-events-none"
                    )}
                    aria-hidden="true"
                  />
                </>
              )}
            </Radio>
          ))}
      </div>
    </RadioGroup>
  );
}
