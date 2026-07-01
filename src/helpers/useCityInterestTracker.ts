"use client";

import { useEffect, useRef } from "react";
import { recordCityEvent, type CityEventType } from "./cityInterest";

/**
 * Record ONE city-interest event per (eventType, city) for the lifetime of the
 * mount. A useRef guard makes this idempotent across the re-renders and React
 * Query refetches that would otherwise fire duplicate writes.
 *
 * A falsy city is a safe no-op (e.g. while a detail query is still loading).
 */
export function useCityInterestTracker(
  city: unknown,
  eventType: CityEventType = "view",
  price?: unknown
): void {
  const recorded = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!city || typeof city !== "string") return;
    const key = `${eventType}:${city}`;
    if (recorded.current.has(key)) return;
    recorded.current.add(key);
    recordCityEvent(city, eventType, price);
  }, [city, eventType, price]);
}
