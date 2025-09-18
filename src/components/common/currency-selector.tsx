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
    <div className="flex items-center ">
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
const customStyles = {
    control: (provided: any) => ({
      ...provided,
      minHeight: '28px',
      height: '28px',
      fontSize: '0.875rem', // text-sm size
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      padding: 4,
    }),
    clearIndicator: (provided: any) => ({
      ...provided,
      padding: 4,
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: '0 6px',
    }),
    input: (provided: any) => ({
      ...provided,
      margin: 0,
      padding: 0,
    }),
    indicatorsContainer: (provided: any) => ({
      ...provided,
      height: '28px',
    }),
  };
  const options: CurrencyOption[] = currencies.map((curr) => ({
    value: curr.code,
    label: curr.name,
    code: curr.code,
    countryCode: curr.countryCode,
    flag: curr.flag ?? "",
  }));

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
      className="currency-selector text-sm "
      classNamePrefix="select"
      components={{ IndicatorSeparator: () => null }}
      //  styles={{
      //     menuList: (base) => ({
      //       ...base,
      //       maxHeight: "200px",
      //       customStyles
      //     }),
      //   }}
        styles={customStyles}
    />
  );
}
