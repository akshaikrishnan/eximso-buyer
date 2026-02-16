"use client";

import { useEffect, useMemo, useState } from "react";
import Select, { SingleValue } from "react-select";
import {
  CountryCode,
  getCountries,
  getCountryCallingCode,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js";

const toFlagEmoji = (countryCode: string) =>
  countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));

type CountryOption = {
  value: CountryCode;
  label: string;
  dialCode: string;
  flag: string;
};

const countryName = new Intl.DisplayNames(["en"], { type: "region" });

const COUNTRY_OPTIONS: CountryOption[] = getCountries().map((country) => ({
  value: country,
  label: countryName.of(country) || country,
  dialCode: `+${getCountryCallingCode(country)}`,
  flag: toFlagEmoji(country),
}));

const detectCountryFromCookies = (): CountryCode | undefined => {
  if (typeof document === "undefined") return undefined;

  const cookieMap = document.cookie
    .split(";")
    .map((value) => value.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((acc, pair) => {
      const [key, ...rest] = pair.split("=");
      if (!key) return acc;
      acc[key] = decodeURIComponent(rest.join("="));
      return acc;
    }, {});

  const possible = [
    cookieMap.loc_country,
    cookieMap.country,
    cookieMap.countryCode,
  ]
    .filter(Boolean)
    .map((value) => value!.toUpperCase());

  const matched = possible.find((value) =>
    COUNTRY_OPTIONS.some((option) => option.value === value)
  );

  return matched as CountryCode | undefined;
};

export const getInitialPhoneCountry = (
  explicitCountry?: string
): CountryCode => {
  const explicit = explicitCountry?.toUpperCase();
  if (explicit && COUNTRY_OPTIONS.some((option) => option.value === explicit)) {
    return explicit as CountryCode;
  }

  return "IN";
};

export const validatePhoneByCountry = (
  value: string,
  country: CountryCode
): boolean => {
  if (!value?.trim()) return false;

  const parsed = parsePhoneNumberFromString(value, country);
  if (!parsed) return false;

  return isValidPhoneNumber(parsed.number);
};

interface PhoneNumberInputProps {
  value?: string;
  onChange: (value: string, country: CountryCode) => void;
  onBlur?: () => void;
  defaultCountry?: string;
  placeholder?: string;
  containerClassName?: string;
  inputClassName?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  error?: boolean;
}

export default function PhoneNumberInput({
  value = "",
  onChange,
  onBlur,
  defaultCountry,
  placeholder = "Phone number",
  containerClassName = "",
  inputClassName = "",
  disabled,
  id,
  name,
  error,
}: PhoneNumberInputProps) {
  const [country, setCountry] = useState<CountryCode>(
    getInitialPhoneCountry(defaultCountry)
  );
  const [nationalNumber, setNationalNumber] = useState("");

  useEffect(() => {
    const cookieCountry = detectCountryFromCookies();
    if (cookieCountry) {
      setCountry(cookieCountry);
    }
  }, []);

  useEffect(() => {
    if (!value) {
      setNationalNumber("");
      return;
    }

    const parsed = parsePhoneNumberFromString(value, country);
    if (parsed) {
      setCountry(parsed.country || country);
      setNationalNumber(parsed.nationalNumber);
      return;
    }

    const digits = value.replace(/\D/g, "");
    setNationalNumber(digits);
  }, [value, country]);

  const selectedOption = useMemo(
    () => COUNTRY_OPTIONS.find((option) => option.value === country) ?? COUNTRY_OPTIONS[0],
    [country]
  );

  const selectStyles = {
    control: (base: any) => ({
      ...base,
      minHeight: "44px",
      borderRadius: "0.75rem",
      borderColor: error ? "#ef4444" : "#d1d5db",
      boxShadow: "none",
      ":hover": { borderColor: error ? "#ef4444" : "#9ca3af" },
    }),
    menuPortal: (base: any) => ({ ...base, zIndex: 100 }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused ? "#eef2ff" : "white",
      color: "#111827",
    }),
  };

  const handleCountryChange = (option: SingleValue<CountryOption>) => {
    if (!option) return;
    setCountry(option.value);

    const parsed = parsePhoneNumberFromString(nationalNumber, option.value);
    onChange(parsed?.number || `${option.dialCode}${nationalNumber}`, option.value);
  };

  const handleNumberChange = (nextValue: string) => {
    const digits = nextValue.replace(/\D/g, "");
    setNationalNumber(digits);

    const parsed = parsePhoneNumberFromString(digits, country);
    const formatted = parsed?.number || `${selectedOption.dialCode}${digits}`;
    onChange(formatted, country);
  };

  return (
    <div className={`flex gap-2 ${containerClassName}`}>
      <div className="min-w-[180px]">
        <Select
          options={COUNTRY_OPTIONS}
          isSearchable
          isDisabled={disabled}
          value={selectedOption}
          classNamePrefix="phone-country"
          menuPortalTarget={typeof window !== "undefined" ? document.body : undefined}
          styles={selectStyles}
          onChange={handleCountryChange}
          formatOptionLabel={(option) => (
            <div className="flex items-center gap-2">
              <span>{option.flag}</span>
              <span>{option.label}</span>
              <span className="text-gray-500">{option.dialCode}</span>
            </div>
          )}
          getOptionLabel={(option) => `${option.label} ${option.dialCode}`}
        />
      </div>

      <input
        id={id}
        name={name}
        type="tel"
        inputMode="tel"
        disabled={disabled}
        value={nationalNumber}
        onBlur={onBlur}
        onChange={(event) => handleNumberChange(event.target.value)}
        placeholder={placeholder}
        className={inputClassName}
      />
    </div>
  );
}
