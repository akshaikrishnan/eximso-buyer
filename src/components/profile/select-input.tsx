// components/SelectInput.tsx
import React from "react";
import { Controller } from "react-hook-form";
import Select from "react-select";

type SelectInputProps = {
  control: any;
  name: string;
  label: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  required?: boolean;
  errors?: any;
  className?: string;
};

export const SelectInput = ({
  control,
  name,
  label,
  options,
  placeholder = "Select...",
  required = false,
  errors,
  className = "sm:col-span-4",
}: SelectInputProps) => (
  <div className={className}>
    <label className="block text-sm font-medium leading-6 text-gray-900">
      {label}
      {required && <span className="text-red-600">*</span>}
    </label>
    <div className="mt-2">
      <Controller
        name={name}
        control={control}
        rules={{ required: required ? `${label} is required` : false }}
        render={({ field }) => (
          <Select
            {...field}
            options={options}
            placeholder={placeholder}
            className="react-select-container"
            classNamePrefix="react-select"
            onChange={(selectedOption) => field.onChange(selectedOption?.value)}
            value={options.find((option) => option.value === field.value)}
            styles={{
              control: (base) => ({
                ...base,
                borderColor: errors?.[name] ? "#ef4444" : "#e5e7eb",
                borderRadius: "0.375rem",
                paddingTop: "0.375rem",
                paddingBottom: "0.375rem",
                minHeight: "auto",
              }),
            }}
          />
        )}
      />
      {errors?.[name] && (
        <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
      )}
    </div>
  </div>
);
