import { useCallback } from "react";

import { useLocale } from "@/hooks/use-locale";

export function useBilingual() {
  const { isVietnamese } = useLocale();

  return useCallback(
    (english: string, vietnamese: string) =>
      isVietnamese ? vietnamese : english,
    [isVietnamese],
  );
}
