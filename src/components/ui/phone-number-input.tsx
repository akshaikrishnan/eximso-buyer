"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

  const possible = [cookieMap.loc_country, cookieMap.country, cookieMap.countryCode]
    .filter(Boolean)
    .map((value) => value!.toUpperCase());

  const matched = possible.find((value) =>
    COUNTRY_OPTIONS.some((option) => option.value === value)
  );

  return matched as CountryCode | undefined;
};

export const getInitialPhoneCountry = (explicitCountry?: string): CountryCode => {
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
  const [menuWidth, setMenuWidth] = useState<number>();
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cookieCountry = detectCountryFromCookies();
    if (cookieCountry) {
      setCountry(cookieCountry);
    }
  }, []);

  useEffect(() => {
    const fallbackCountry = getInitialPhoneCountry(defaultCountry);
    setCountry((prev) => (prev === fallbackCountry ? prev : fallbackCountry));
  }, [defaultCountry]);

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

    setNationalNumber(value.replace(/\D/g, ""));
  }, [value, country]);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const updateWidth = () => {
      if (!wrapperRef.current) return;
      setMenuWidth(wrapperRef.current.getBoundingClientRect().width);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(wrapperRef.current);

    return () => observer.disconnect();
  }, []);

  const selectedOption = useMemo(
    () =>
      COUNTRY_OPTIONS.find((option) => option.value === country) ??
      COUNTRY_OPTIONS[0],
    [country]
  );

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

  const baseInputClasses =
    "h-11 w-full border-0 bg-transparent px-3 text-sm text-gray-900 outline-hidden placeholder:text-gray-400 disabled:cursor-not-allowed disabled:text-gray-400";

  return (
    <div
      ref={wrapperRef}
      className={`flex w-full overflow-hidden rounded-xl border ${
        error ? "border-red-500" : "border-gray-300"
      } bg-white shadow-xs focus-within:ring-2 focus-within:ring-indigo-200 ${
        containerClassName || ""
      }`}
    >
      <div className="min-w-[110px] border-r border-gray-200">
        <Select
          options={COUNTRY_OPTIONS}
          isSearchable
          isDisabled={disabled}
          value={selectedOption}
          classNamePrefix="phone-country"
          menuPortalTarget={typeof window !== "undefined" ? document.body : undefined}
          menuPosition="fixed"
          placeholder="+91"
          onChange={handleCountryChange}
          styles={{
            control: (base) => ({
              ...base,
              minHeight: "44px",
              height: "44px",
              border: 0,
              borderRadius: 0,
              boxShadow: "none",
              backgroundColor: "transparent",
            }),
            valueContainer: (base) => ({
              ...base,
              padding: "0 8px",
            }),
            indicatorsContainer: (base) => ({
              ...base,
              height: "44px",
            }),
            indicatorSeparator: () => ({ display: "none" }),
            singleValue: (base) => ({
              ...base,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              margin: 0,
              color: "#111827",
              fontSize: "14px",
              maxWidth: "none",
            }),
            input: (base) => ({
              ...base,
              margin: 0,
              padding: 0,
            }),
            menuPortal: (base) => ({ ...base, zIndex: 100 }),
            menu: (base) => ({
              ...base,
              width: menuWidth ?? base.width,
              minWidth: menuWidth ?? base.minWidth,
              marginTop: 4,
            }),
            menuList: (base) => ({
              ...base,
              maxHeight: 280,
              overflowX: "hidden",
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isFocused ? "#eef2ff" : "white",
              color: "#111827",
              padding: "10px 12px",
            }),
          }}
          formatOptionLabel={(option, meta) => {
            if (meta.context === "value") {
              return (
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <span>{option.flag}</span>
                  <span>{option.dialCode}</span>
                </div>
              );
            }

            return (
              <div className="flex min-w-0 items-center gap-2">
                <span className="shrink-0">{option.flag}</span>
                <span className="truncate">{option.label}</span>
                <span className="ml-auto shrink-0 text-gray-500">{option.dialCode}</span>
              </div>
            );
          }}
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
        className={`${baseInputClasses} ${inputClassName || ""}`}
      />
    </div>
  );
}
