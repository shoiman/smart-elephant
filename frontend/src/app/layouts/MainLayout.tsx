import { Outlet } from "react-router-dom";
import { Header } from "../../widgets/Header/Header";

export function MainLayout() {
  return (
    <div className="app-shell">
      <Header />

      <main className="app-shell__main">
        <Outlet />
      </main>
    </div>
  );
}