"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type CityItem = {
  id: string | number;
  name: string;
  lat: string;
  lon: string;
  type?: string;
  class?: string;
  address?: Record<string, any>;
};

interface CitySearchProps {
  placeholder?: string;
  countrycodes?: string; // e.g., "in"; can accept comma-separated codes
  limit?: number;
  onSelect: (item: CityItem) => void;
}

export default function CitySearch({ placeholder = "Search city", countrycodes = "in", limit = 8, onSelect }: CitySearchProps) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<CityItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const canSearch = query.trim().length >= 2;

  useEffect(() => {
    if (!canSearch) {
      setItems([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    const url = new URL("/api/geocode", window.location.origin);
    url.searchParams.set("q", query.trim());
    url.searchParams.set("limit", String(limit));
    if (countrycodes) url.searchParams.set("countrycodes", countrycodes);

    fetch(url.toString(), { signal: ac.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(`Geocode error: ${r.status}`);
        const json = await r.json();
        setItems(json.items || []);
        setOpen(true);
      })
      .catch((e) => {
        if (e.name !== "AbortError") {
          setItems([]);
          setOpen(false);
        }
      })
      .finally(() => setLoading(false));

    return () => ac.abort();
  }, [query, countrycodes, limit, canSearch]);

  function handleSelect(item: CityItem) {
    onSelect(item);
    setQuery(item.name);
    setOpen(false);
  }

  return (
    <div className="relative">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-autocomplete="list"
        aria-expanded={open}
      />
      {open && items.length > 0 && (
        <Card className="absolute z-20 mt-1 max-h-72 w-full overflow-auto">
          <div className="divide-y">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                className="w-full text-left px-3 py-2 hover:bg-accent"
                onClick={() => handleSelect(item)}
              >
                <div className="text-sm">{item.name}</div>
                <div className="text-xs text-muted-foreground">{item.lat}, {item.lon}</div>
              </button>
            ))}
          </div>
        </Card>
      )}
      {loading && (
        <div className="absolute right-2 top-2 text-xs text-muted-foreground">Searching…</div>
      )}
    </div>
  );
}


