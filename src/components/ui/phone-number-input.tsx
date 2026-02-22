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

const toFlagEmoji = (code: string): string => {
  if (!/^[A-Za-z]{2}$/.test(code)) return "🏳";
  return code
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
};

type CountryOption = {
  value: CountryCode;
  label: string;
  dialCode: string;
  flag: string;
};

const countryName = new Intl.DisplayNames(["en"], { type: "region" });

const COUNTRY_OPTIONS: CountryOption[] = getCountries()
  .map((country) => ({
    value: country,
    label: countryName.of(country) ?? country,
    dialCode: `+${getCountryCallingCode(country)}`,
    flag: toFlagEmoji(country),
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

const detectCountryFromCookies = (): CountryCode | undefined => {
  if (typeof document === "undefined") return undefined;

  const cookieMap = document.cookie
    .split(";")
    .map((v) => v.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((acc, pair) => {
      const idx = pair.indexOf("=");
      if (idx === -1) return acc;
      const key = pair.slice(0, idx).trim();
      const val = decodeURIComponent(pair.slice(idx + 1));
      acc[key] = val;
      return acc;
    }, {});

  const possible = [cookieMap.loc_country, cookieMap.country, cookieMap.countryCode]
    .filter(Boolean)
    .map((v) => v!.toUpperCase());

  const matched = possible.find((v) =>
    COUNTRY_OPTIONS.some((opt) => opt.value === v)
  );

  return matched as CountryCode | undefined;
};

export const getInitialPhoneCountry = (explicitCountry?: string): CountryCode => {
  const explicit = explicitCountry?.toUpperCase();
  if (explicit && COUNTRY_OPTIONS.some((opt) => opt.value === explicit)) {
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
  const [mounted, setMounted] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Track whether the current value change was triggered by the user typing
  // so we can skip the useEffect sync and avoid the 91-injection loop
  const isInternalChange = useRef(false);

  // Prevent SSR/hydration mismatch for menuPortalTarget
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-detect country from cookies on mount (client only)
  useEffect(() => {
    const cookieCountry = detectCountryFromCookies();
    if (cookieCountry) {
      setCountry(cookieCountry);
    }
  }, []);

  // Sync defaultCountry prop changes
  useEffect(() => {
    const next = getInitialPhoneCountry(defaultCountry);
    setCountry(next);
  }, [defaultCountry]);

  // Sync external value prop changes (e.g. form reset, pre-fill)
  // Skipped when the change was triggered by the user typing
  useEffect(() => {
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }

    if (!value) {
      setNationalNumber("");
      return;
    }

    const parsed = parsePhoneNumberFromString(value, country);
    if (parsed) {
      setCountry(parsed.country ?? country);
      setNationalNumber(parsed.nationalNumber);
      return;
    }

    // Safely strip dial code prefix to avoid injecting country code digits
    const dialCode = getCountryCallingCode(country);
    const digits = value.replace(/\D/g, "");
    const stripped = digits.startsWith(dialCode)
      ? digits.slice(dialCode.length)
      : digits;
    setNationalNumber(stripped);
  }, [value, country]);

  // Track wrapper width for dropdown menu alignment
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
    () => COUNTRY_OPTIONS.find((opt) => opt.value === country) ?? COUNTRY_OPTIONS[0],
    [country]
  );

  const handleCountryChange = (option: SingleValue<CountryOption>) => {
    if (!option) return;
    setCountry(option.value);

    isInternalChange.current = true;
    const parsed = parsePhoneNumberFromString(nationalNumber, option.value);
    onChange(parsed?.number ?? `${option.dialCode}${nationalNumber}`, option.value);
  };

  const handleNumberChange = (nextValue: string) => {
    const digits = nextValue.replace(/\D/g, "");
    setNationalNumber(digits);

    // Flag as internal so the value sync useEffect doesn't re-process it
    isInternalChange.current = true;

    const parsed = parsePhoneNumberFromString(digits, country);
    const formatted = parsed?.number ?? `${selectedOption.dialCode}${digits}`;
    onChange(formatted, country);
  };

  const baseInputClasses =
    "h-11 w-full border-0 bg-transparent px-3 text-sm text-gray-900 outline-hidden placeholder:text-gray-400 disabled:cursor-not-allowed disabled:text-gray-400";

  return (
    <div
      ref={wrapperRef}
      className={`flex w-full overflow-hidden rounded-xl border ${
        error ? "border-red-500" : "border-gray-300"
      } bg-white shadow-xs focus-within:ring-2 focus-within:ring-indigo-200 ${containerClassName}`}
    >
      <div className="min-w-[110px] border-r border-gray-200">
        <Select
          options={COUNTRY_OPTIONS}
          isSearchable
          isDisabled={disabled}
          value={selectedOption}
          classNamePrefix="phone-country"
          menuPortalTarget={mounted ? document.body : undefined}
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
            valueContainer: (base) => ({ ...base, padding: "0 8px" }),
            indicatorsContainer: (base) => ({ ...base, height: "44px" }),
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
            input: (base) => ({ ...base, margin: 0, padding: 0 }),
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
        onChange={(e) => handleNumberChange(e.target.value)}
        placeholder={placeholder}
        className={`${baseInputClasses} ${inputClassName}`}
      />
    </div>
  );
}