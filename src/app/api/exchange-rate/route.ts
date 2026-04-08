import { NextResponse } from "next/server";

const FALLBACK_RATE = 38;
let cachedRate: { rate: number; timestamp: number } | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

async function fetchRate(): Promise<number> {
  // Try exchangerate-api (free, no key required)
  try {
    const res = await fetch(
      "https://open.er-api.com/v6/latest/USD",
      { next: { revalidate: 3600 } }
    );
    if (res.ok) {
      const data = await res.json();
      if (data.rates?.TRY) return data.rates.TRY;
    }
  } catch {}

  // Fallback: frankfurter (ECB data, free)
  try {
    const res = await fetch(
      "https://api.frankfurter.dev/v1/latest?base=USD&symbols=TRY"
    );
    if (res.ok) {
      const data = await res.json();
      if (data.rates?.TRY) return data.rates.TRY;
    }
  } catch {}

  return FALLBACK_RATE;
}

export async function GET() {
  const now = Date.now();

  if (cachedRate && now - cachedRate.timestamp < CACHE_DURATION) {
    return NextResponse.json({ rate: cachedRate.rate });
  }

  const rate = await fetchRate();
  cachedRate = { rate, timestamp: now };

  return NextResponse.json(
    { rate },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" } }
  );
}
