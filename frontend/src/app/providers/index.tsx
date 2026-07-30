import type { PropsWithChildren } from "react";

import { I18nProvider } from "../../shared/i18n";

export function AppProviders({ children }: PropsWithChildren) {
  return <I18nProvider>{children}</I18nProvider>;
}
