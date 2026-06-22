"use client";

import { useCallback, useEffect, useState } from "react";

interface UseEntitySearchProps<T extends Record<string, unknown>> {
  params: T;
  setParams: (params: Partial<T>) => void;
}

export const useEntitySearch = <T extends Record<string, unknown>>({
  params,
  setParams,
}: UseEntitySearchProps<T>) => {
  const [searchValue, setSearchValue] = useState(
    (params.search as string) ?? "",
  );

  useEffect(() => {
    setSearchValue((params.search as string) ?? "");
  }, [params.search]);

  const onSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value);

      const timeout = setTimeout(() => {
        setParams({
          search: value,
          page: 1,
        } as unknown as Partial<T>);
      }, 500);

      return () => clearTimeout(timeout);
    },
    [setParams],
  );

  return {
    searchValue,
    onSearchChange,
  };
};
