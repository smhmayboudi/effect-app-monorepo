import type {
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
} from "@tanstack/react-table";

import { useMemo, useState } from "react";

export type NavigateFn = (opts: {
  replace?: boolean;
  search:
    | ((prev: SearchRecord) => Partial<SearchRecord> | SearchRecord)
    | SearchRecord
    | true;
}) => void;

export type SearchRecord = Record<string, unknown>;

type UseTableUrlStateParams = {
  columnFilters?: Array<
    | {
        columnId: string;
        deserialize?: (value: unknown) => unknown;
        searchKey: string;
        // Optional transformers for custom types
        serialize?: (value: unknown) => unknown;
        type?: "string";
      }
    | {
        columnId: string;
        deserialize?: (value: unknown) => unknown;
        searchKey: string;
        serialize?: (value: unknown) => unknown;
        type: "array";
      }
  >;
  globalFilter?: {
    enabled?: boolean;
    key?: string;
    trim?: boolean;
  };
  navigate: NavigateFn;
  pagination?: {
    defaultPage?: number;
    defaultPageSize?: number;
    pageKey?: string;
    pageSizeKey?: string;
  };
  search: SearchRecord;
};

type UseTableUrlStateReturn = {
  // Column filters
  columnFilters: ColumnFiltersState;
  // Helpers
  ensurePageInRange: (
    pageCount: number,
    opts?: { resetTo?: "first" | "last" },
  ) => void;
  // Global filter
  globalFilter?: string;
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
  onGlobalFilterChange?: OnChangeFn<string>;
  onPaginationChange: OnChangeFn<PaginationState>;
  // Pagination
  pagination: PaginationState;
};

export function useTableUrlState(
  params: UseTableUrlStateParams,
): UseTableUrlStateReturn {
  const {
    columnFilters: columnFiltersCfg = [],
    globalFilter: globalFilterCfg,
    navigate,
    pagination: paginationCfg,
    search,
  } = params;

  const pageKey = paginationCfg?.pageKey ?? ("page" as string);
  const pageSizeKey = paginationCfg?.pageSizeKey ?? ("pageSize" as string);
  const defaultPage = paginationCfg?.defaultPage ?? 1;
  const defaultPageSize = paginationCfg?.defaultPageSize ?? 10;

  const globalFilterKey = globalFilterCfg?.key ?? ("filter" as string);
  const globalFilterEnabled = globalFilterCfg?.enabled ?? true;
  const trimGlobal = globalFilterCfg?.trim ?? true;

  // Build initial column filters from the current search params
  const initialColumnFilters: ColumnFiltersState = useMemo(() => {
    const collected: ColumnFiltersState = [];
    for (const cfg of columnFiltersCfg) {
      const raw = (search as SearchRecord)[cfg.searchKey];
      const deserialize = cfg.deserialize ?? ((v: unknown) => v);
      if (cfg.type === "string") {
        const value = (deserialize(raw) as string) ?? "";
        if (typeof value === "string" && value.trim() !== "") {
          collected.push({ id: cfg.columnId, value });
        }
      } else {
        // default to array type
        const value = (deserialize(raw) as unknown[]) ?? [];
        if (Array.isArray(value) && value.length > 0) {
          collected.push({ id: cfg.columnId, value });
        }
      }
    }
    return collected;
  }, [columnFiltersCfg, search]);

  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialColumnFilters);

  const pagination: PaginationState = useMemo(() => {
    const rawPage = (search as SearchRecord)[pageKey];
    const rawPageSize = (search as SearchRecord)[pageSizeKey];
    const pageNum = typeof rawPage === "number" ? rawPage : defaultPage;
    const pageSizeNum =
      typeof rawPageSize === "number" ? rawPageSize : defaultPageSize;

    return { pageIndex: Math.max(0, pageNum - 1), pageSize: pageSizeNum };
  }, [search, pageKey, pageSizeKey, defaultPage, defaultPageSize]);

  const onPaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next = typeof updater === "function" ? updater(pagination) : updater;
    const nextPage = next.pageIndex + 1;
    const nextPageSize = next.pageSize;
    navigate({
      search: (prev) => ({
        ...(prev as SearchRecord),
        [pageKey]: nextPage <= defaultPage ? undefined : nextPage,
        [pageSizeKey]:
          nextPageSize === defaultPageSize ? undefined : nextPageSize,
      }),
    });
  };

  const [globalFilter, setGlobalFilter] = useState<string | undefined>(() => {
    if (!globalFilterEnabled) {
      return undefined;
    }
    const raw = (search as SearchRecord)[globalFilterKey];

    return typeof raw === "string" ? raw : "";
  });

  const onGlobalFilterChange: OnChangeFn<string> | undefined =
    globalFilterEnabled
      ? (updater) => {
          const next =
            typeof updater === "function"
              ? updater(globalFilter ?? "")
              : updater;
          const value = trimGlobal ? next.trim() : next;
          setGlobalFilter(value);
          navigate({
            search: (prev) => ({
              ...(prev as SearchRecord),
              [globalFilterKey]: value ? value : undefined,
              [pageKey]: undefined,
            }),
          });
        }
      : undefined;

  const onColumnFiltersChange: OnChangeFn<ColumnFiltersState> = (updater) => {
    const next =
      typeof updater === "function" ? updater(columnFilters) : updater;
    setColumnFilters(next);

    const patch: Record<string, unknown> = {};

    for (const cfg of columnFiltersCfg) {
      const found = next.find((f) => f.id === cfg.columnId);
      const serialize = cfg.serialize ?? ((v: unknown) => v);
      if (cfg.type === "string") {
        const value =
          typeof found?.value === "string" ? (found.value as string) : "";
        patch[cfg.searchKey] =
          value.trim() !== "" ? serialize(value) : undefined;
      } else {
        const value = Array.isArray(found?.value)
          ? (found!.value as unknown[])
          : [];
        patch[cfg.searchKey] = value.length > 0 ? serialize(value) : undefined;
      }
    }

    navigate({
      search: (prev) => ({
        ...(prev as SearchRecord),
        [pageKey]: undefined,
        ...patch,
      }),
    });
  };

  const ensurePageInRange = (
    pageCount: number,
    opts: { resetTo?: "first" | "last" } = { resetTo: "first" },
  ) => {
    const currentPage = (search as SearchRecord)[pageKey];
    const pageNum = typeof currentPage === "number" ? currentPage : defaultPage;
    if (pageCount > 0 && pageNum > pageCount) {
      navigate({
        replace: true,
        search: (prev) => ({
          ...(prev as SearchRecord),
          [pageKey]: opts.resetTo === "last" ? pageCount : undefined,
        }),
      });
    }
  };

  return {
    columnFilters,
    ensurePageInRange,
    globalFilter: globalFilterEnabled ? (globalFilter ?? "") : undefined,
    onColumnFiltersChange,
    onGlobalFilterChange,
    onPaginationChange,
    pagination,
  };
}
