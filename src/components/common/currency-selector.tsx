"use client";

import { useCurrency } from "@/contexts/currency.context";
import Select, { SingleValue } from "react-select";
import currencies from "@/lib/data/db/currencies-with-flags.json";
import { useQueryClient } from "@tanstack/react-query";

interface CurrencyOption {
  value: string;
  label: string;
  code: string;
  countryCode: string;
  flag: string;
}

export function CurrencySelector() {
  const { currentCurrency, setCurrency, rates } = useCurrency();
  const queryClient = useQueryClient();

  const formatOptionLabel = ({ code, flag, countryCode }: CurrencyOption) => (
    <div className="flex items-center gap-2">
      <img
        src={flag}
        alt={countryCode}
        className="w-5 h-4 object-cover rounded-sm"
      />
      <span className="font-medium">{code}</span>
      <span className="text-neutral-500 ml-1 hidden sm:inline">
        ({countryCode})
      </span>
    </div>
  );

  const options: CurrencyOption[] = currencies.map((curr) => ({
    value: curr.code,
    label: curr.name,
    code: curr.code,
    countryCode: curr.countryCode,
    flag: curr.flag ?? "",
  }));

  console.log(currencies);

  const handleChange = (selectedOption: SingleValue<CurrencyOption>) => {
    if (selectedOption) {
      setCurrency(selectedOption.value);
      queryClient.invalidateQueries({ queryKey: ["exchangeRates"] });
    }
  };

  return (
    <Select<CurrencyOption>
      options={options}
      value={options.find((option) => option.value === currentCurrency)}
      onChange={handleChange}
      formatOptionLabel={formatOptionLabel}
      isSearchable
      placeholder="Select currency..."
      className="currency-selector text-sm"
      classNamePrefix="select"
      components={{ IndicatorSeparator: () => null }}
    />
  );
}
