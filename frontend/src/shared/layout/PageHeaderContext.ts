import { createContext, useContext, useEffect } from "react";

/** What a page wants to show in the center of the shared header. */
export interface PageHeaderConfig {
  readonly title?: string;
  readonly progress?: { readonly current: number; readonly total: number };
}

export interface PageHeaderContextValue {
  readonly config: PageHeaderConfig;
  readonly setConfig: (config: PageHeaderConfig) => void;
}

export const PageHeaderContext = createContext<PageHeaderContextValue | null>(null);

export function usePageHeaderState(): PageHeaderContextValue {
  const context = useContext(PageHeaderContext);
  if (context === null) {
    throw new Error("usePageHeaderState must be used within MainLayout.");
  }
  return context;
}

/** Lets a page configure the shared header while it is mounted. */
export function usePageHeader({ title, progress }: PageHeaderConfig): void {
  const { setConfig } = usePageHeaderState();
  const current = progress?.current;
  const total = progress?.total;

  useEffect(() => {
    setConfig({
      title,
      progress: current !== undefined && total !== undefined ? { current, total } : undefined,
    });
  }, [setConfig, title, current, total]);

  useEffect(() => () => setConfig({}), [setConfig]);
}
