"use client";

import { useMultiQueryParam } from "@/hooks/use-multi-query-params";

export default function FilterCheckbox({
  sectionId,
  option,
  inputId,
}: {
  sectionId: string;
  option: { value: string; label: string };
  inputId: string;
}) {
  const { has, toggle } = useMultiQueryParam(sectionId);

  return (
    <div className="flex items-center">
      <input
        id={inputId}
        name={`${sectionId}[]`}
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        checked={has(option.value)}
        onChange={() => toggle(option.value)}
      />
      <label htmlFor={inputId} className="ml-3 text-sm text-gray-600">
        {option.label}
      </label>
    </div>
  );
}
