// app/api/geo/route.ts
import { NextResponse, type NextRequest } from "next/server";
import currencyData from "@/lib/data/db/currencies-with-flags.json";

export const runtime = "edge"; // fast & has access to Vercel headers

type CurrencyItem = {
  code: string; // e.g., "INR"
  name: string;
  country: string;
  countryCode: string;
  flag?: string; // base64
};

function pickCurrency(countryCode?: string | null): string | null {
  if (!countryCode) return null;
  const cc = countryCode.toUpperCase();
  const match = (currencyData as CurrencyItem[]).find(
    (c) => c.countryCode.toUpperCase() === cc
  );
  return match?.code ?? null;
}

function normalizeFloat(v: string | number | null | undefined): string | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  if (Number.isNaN(n)) return null;
  return n.toFixed(6);
}

function safeDecode(v: string | null | undefined) {
  if (!v) return null;
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
}

function readGeo(req: NextRequest) {
  const city = safeDecode(req.headers.get("x-vercel-ip-city")) ?? null;
  const countryCode =
    safeDecode(req.headers.get("x-vercel-ip-country")) ?? null;
  const region =
    safeDecode(req.headers.get("x-vercel-ip-country-region")) ?? null;
  const tz = safeDecode(req.headers.get("x-vercel-ip-timezone")) ?? null;
  const latitude = safeDecode(
    normalizeFloat(req.headers.get("x-vercel-ip-latitude"))
  );
  const longitude = safeDecode(
    normalizeFloat(req.headers.get("x-vercel-ip-longitude"))
  );

  return { city, countryCode, region, tz, latitude, longitude };
}

export async function GET(req: NextRequest) {
  const geo = readGeo(req);

  // derive currency
  const default_currency =
    pickCurrency(geo.countryCode) ??
    // sensible fallback if unknown
    "INR";

  const payload = {
    city: geo.city,
    countryCode: geo.countryCode,
    region: geo.region,
    timezone: geo.tz,
    latitude: geo.latitude,
    longitude: geo.longitude,
    default_currency,
    ui: geo.city
      ? geo.city
      : `${geo.countryCode}${geo.region ? "-" + geo.region : ""}`,
  };

  const res = NextResponse.json(payload);

  const cookieOpts = {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: "lax" as const,
    secure: false,
  };

  //  (avoids blank cookies in dev)
  if (payload.city) res.cookies.set("loc_city", payload.city, cookieOpts);
  if (payload.countryCode)
    res.cookies.set("loc_country", payload.countryCode, cookieOpts);
  if (payload.region) res.cookies.set("loc_region", payload.region, cookieOpts);
  if (payload.latitude)
    res.cookies.set("loc_lat", payload.latitude, cookieOpts);
  if (payload.longitude)
    res.cookies.set("loc_lng", payload.longitude, cookieOpts);
  if (payload.timezone) res.cookies.set("loc_tz", payload.timezone, cookieOpts);
  if (payload.default_currency)
    res.cookies.set("default_currency", payload.default_currency, cookieOpts);

  return res;
}

export const POST = GET;
