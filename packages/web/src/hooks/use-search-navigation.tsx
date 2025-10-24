"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import type { NavigateFn, SearchRecord } from "./use-table-url-state"

export function useSearchNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const search: SearchRecord = {}
  for (const [key, value] of searchParams.entries()) {
    search[key] = parseSearchParamValue(value)
  }

  const navigate: NavigateFn = (opts) => {
    let newSearch: SearchRecord

    if (opts.search === true) {
      newSearch = search
    } else if (typeof opts.search === "function") {
      const result = opts.search(search)
      newSearch = {
        ...search,
        ...result,
      } as SearchRecord
    } else {
      newSearch = {
        ...search,
        ...opts.search,
      } as SearchRecord
    }

    const params = new URLSearchParams()
    Object.entries(newSearch).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value) && value.length === 0) {
          return
        }

        // Handle different value types appropriately
        if (Array.isArray(value)) {
          params.set(key, JSON.stringify(value))
        } else if (typeof value === "number") {
          params.set(key, value.toString())
        } else if (typeof value === "boolean") {
          params.set(key, value.toString())
        } else if (typeof value === "string" && value.trim() !== "") {
          params.set(key, value)
        }
      }
    })

    const queryString = params.toString()
    const url = queryString ? `${pathname}?${queryString}` : pathname
    const currentQueryString = searchParams.toString()
    const currentUrl = currentQueryString
      ? `${pathname}?${currentQueryString}`
      : pathname
    if (currentUrl === url) {
      return
    }

    if (opts.replace) {
      router.replace(url, { scroll: false })
    } else {
      router.push(url, { scroll: false })
    }
  }

  return { navigate, search }
}

// Improved value parser that handles numbers, arrays, and strings
function parseSearchParamValue(value: string): number | string | string[] {
  // Try to parse as number first
  if (/^\d+$/.test(value)) {
    const num = Number(value)
    if (!isNaN(num)) {
      return num
    }
  }

  // Try to parse as array
  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item))
    }
  } catch {
    // Not valid JSON, continue
  }

  // Return as string
  return value
}
