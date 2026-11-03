import { Navigate, Route, Routes } from "react-router-dom";

import { HomePage } from "../../pages/HomePage";
import { AnimalsPage } from "../../pages/AnimalsPage";
import { GamesPage } from "../../pages/GamesPage";
import { ProgressPage } from "../../pages/parent/ProgressPage";
import { ParentZone } from "../../components/ParentGate/ParentZone";
import { StarsPage } from "../../pages/StarsPage";
import { MainLayout } from "../layouts/MainLayout";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="animals" element={<AnimalsPage />} />
        <Route path="games" element={<GamesPage />} />
        <Route path="stars" element={<StarsPage />} />
        {/* Parents' zone: every page behind the hold-to-unlock gate */}
        <Route path="parent" element={<ParentZone />}>
          <Route path="progress" element={<ProgressPage />} />
        </Route>
        <Route path="progress" element={<Navigate replace to="/stars" />} />
      </Route>
    </Routes>
  );
}
