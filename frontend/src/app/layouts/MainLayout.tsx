import { useMemo, useState } from "react";
import { Outlet } from "react-router-dom";

import { PageHeaderContext, type PageHeaderConfig } from "../../shared/layout/PageHeaderContext";
import { Header } from "../../widgets/Header/Header";

export function MainLayout() {
  const [config, setConfig] = useState<PageHeaderConfig>({});
  const headerValue = useMemo(() => ({ config, setConfig }), [config]);

  return (
    <PageHeaderContext.Provider value={headerValue}>
      <div className="app-shell">
        <Header />

        <main className="app-shell__main">
          <Outlet />
        </main>
      </div>
    </PageHeaderContext.Provider>
  );
}
